import {Accessor, Context, createContext, createSignal, Setter, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import UserService from "./UsersService";
import Storage from "./Storage";


interface AppStore {
    groups: Accessor<Group[]>,
    setGroups: Setter<Group[]>,
    userInfo: Accessor<UserInfo>,
    setUserInfo: Setter<UserInfo>,
    authenticated?: Accessor<boolean>,
    setAuthenticated?: Setter<boolean>,
    state: Accessor<any>,
    setState: Setter<any>,
}

interface AppAccessor {

    login(username: string, password: string): Promise<UserInfo>

    register(request: CreateUserRequest): Promise<UserInfo>

    joinGroup(request: JoinGroupRequest): Promise<Group>

    getUser(): Promise<User>

    logout(): Promise<void>
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
        }
    }
}

const UserContext: Context<StateService> = createContext<StateService>(define);

export function UserContextProvider(props: any) {
    const grp: Group[] = Storage.read()?.groups || []
    const usr: UserInfo = Storage.read()?.userInfo || {
        id: "", lastname: "", firstname: "", username: "", lastSeenAt: "", createdAt: "",
    }
    const authz: boolean = Storage.read()?.authenticated || false;

    const [groups, setGroups] = createSignal(grp)
    const [userInfo, setUserInfo] = createSignal(usr)
    const [authenticated, setAuthenticated] = createSignal(authz)
    const [state, setState] = createSignal()

    const newStore: AppStore = {
        groups: groups,
        setGroups: setGroups,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        state: state,
        setState: setState,
    };

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
                debugger
                return new Promise(resolve => {
                    Storage.clear()
                    setAuthenticated(false)
                    setGroups([])
                    setUserInfo({
                        id: "", lastname: "", firstname: "", username: "", lastSeenAt: "", createdAt: "",
                    })
                    resolve()
                })
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