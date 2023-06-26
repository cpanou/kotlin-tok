import {Accessor, Context, createContext, createSignal, Setter, Signal, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import UserService from "./UsersService";
import Storage from "./Storage";
import MessagingService from "./MessagingService";


interface AppStore {
    groups: Accessor<Group[]>,
    userInfo: Accessor<UserInfo>,
    authenticated?: Accessor<boolean>,
    messagingStream: Accessor<GroupMessage>,
}

interface AppAccessor {

    login(username: string, password: string): Promise<UserInfo>

    register(request: CreateUserRequest): Promise<UserInfo>

    joinGroup(request: JoinGroupRequest): Promise<Group>

    getUser(): Promise<User>

    logout(): Promise<void>

    sendMessage(message: GroupMessage): void
}

interface StateService {
    store: AppStore,
    accessor: AppAccessor,
}

const define: StateService = {
    store: {} as AppStore,
    accessor: {
        login(username: string, password: string): Promise<UserInfo> {
            throw new Error("NOT INITIALIZED")
        },
        joinGroup(request: JoinGroupRequest): Promise<Group> {
            throw new Error("NOT INITIALIZED")
        },
        getUser(): Promise<User> {
            throw new Error("NOT INITIALIZED")
        },
        logout(): Promise<void> {
            throw new Error("NOT INITIALIZED")
        },
        register(request: CreateUserRequest): Promise<UserInfo> {
            throw new Error("NOT INITIALIZED")
        },
        sendMessage(message: GroupMessage): Promise<UserInfo> {
            throw new Error("NOT INITIALIZED")
        }
    }
}

const UserContext: Context<StateService> = createContext<StateService>(define);

//This is getting big :(
export function UserContextProvider(props: any) {
    const grp: Group[] = Storage.read()?.groups || []

    const grps: Group[] = Storage.read()?.groups || []

    const usr: UserInfo = Storage.read()?.userInfo || {
        id: "", lastname: "", firstname: "", username: "", lastSeenAt: "", createdAt: "",
    }
    const authz: boolean = Storage.read()?.authenticated || false;

    const [groups, setGroups] = createSignal(grp)
    const [userInfo, setUserInfo] = createSignal(usr)
    const [authenticated, setAuthenticated] = createSignal(authz)
    const [socket, setSocket] = createSignal({} as WebSocket)
    const [messageReceived, setMessageReceived] = createSignal({} as GroupMessage)

    const newStore: AppStore = {
        groups: groups,
        userInfo: userInfo,
        authenticated: authenticated,
        messagingStream: messageReceived,
    };

    const initializeSocket = () => {
        const webSocket = MessagingService.initializeSocket(userInfo(), 15)
        webSocket.addEventListener("message", (event) => {
            console.log("Message from server ", event.data);
            let data = JSON.parse(event.data)
            let grp = groups().find(grp => grp.id === data.groupId)
            if (!!grp) {
                let message: UserMessage = {
                    id: data.id,
                    username: data.username,
                    text: data.text,
                    sentAt: data.sentAt,
                }
                grp.messages.push(message)
                Storage.update({
                    userInfo: userInfo(),
                    groups: groups(),
                    authenticated: true
                })
                setGroups(Storage.read()?.groups || [])
                setMessageReceived({
                    ...message,
                    groupId: data.groupId + ""
                })
            }
        });
        setSocket(webSocket)
    }

    if (authenticated()) {
        initializeSocket()
    }

    const [store] = createStore(newStore)
    const accessorService: StateService = {
        store: store,
        accessor: {
            login(username: string, password: string) {
                return UserService.fetchUser(username)
                    .then(response => {
                        setUserInfo(response.userInfo)
                        setAuthenticated(true)
                        Storage.update({
                            userInfo: userInfo(),
                            authenticated: true
                        })
                        initializeSocket()
                        return userInfo()
                    })
            },
            register(request: CreateUserRequest) {
                return UserService.registerUser(request)
                    .then(res => {
                        setUserInfo(res.userInfo)
                        setAuthenticated(true)
                        Storage.update({
                            userInfo: userInfo(),
                            authenticated: true
                        })
                        initializeSocket()
                        return userInfo()
                    })
            },
            joinGroup(request: JoinGroupRequest) {
                return UserService.userJoinGroup(request, userInfo())
                    .then(res => {
                        setGroups(grps => [...grps, res])
                        Storage.update({
                            userInfo: userInfo(),
                            groups: groups(),
                            authenticated: true
                        })
                        return res
                    })
            },
            getUser() {
                return UserService.fetchConversations(userInfo())
                    .then(res => {
                        setAuthenticated(true)
                        setUserInfo(res.userInfo)
                        setGroups(res.groups)
                        Storage.update({
                            userInfo: userInfo(),
                            groups: groups(),
                            authenticated: true
                        })
                        return res
                    })
            },
            logout() {
                return new Promise(resolve => {
                    setAuthenticated(false)
                    setGroups([])
                    setUserInfo({
                        id: "", lastname: "", firstname: "", username: "", lastSeenAt: "", createdAt: "",
                    })
                    Storage.clear()
                    MessagingService.closeSocket(socket())
                    resolve()
                })
            },
            sendMessage(message: GroupMessage) {
                socket()?.send(JSON.stringify(message))
            }
        }
    }

    return (
        <UserContext.Provider value={accessorService}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUserAccessor() {
    return useContext(UserContext);
}