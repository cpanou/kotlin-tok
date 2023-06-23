const BASE_URL = "http://localhost:8080"; // Replace with your API base URL

interface FetchOptions {
    path: string,
    method?: string,
    auth?: UserInfo,
}

async function execute<T>(uri: string, options: RequestInit): Promise<T> {
    try {
        const response = await fetch(uri, options);

        const res = await response.json();
        if (!response.ok) {
            throw res;
        }
        return res
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function initHeaders(auth: any) {
    let headers: any = {};
    headers["Content-Type"] = "application/json"
    if (!!auth) {
        headers["Authorization"] = `${JSON.stringify(auth)}`
    }
    return headers;
}


async function query<T>(options: FetchOptions): Promise<T> {
    return await execute(`${BASE_URL}${options.path}`, {
        method: options.method || "GET",
        headers: initHeaders(options.auth)
    });
}

async function command<T, R>(data: T, options: FetchOptions): Promise<R> {
    return await execute(`${BASE_URL}${options.path}`, {
        method: options.method || "POST",
        headers: initHeaders(options.auth),
        body: JSON.stringify(data),
    });
}

async function getUserInfo(username: string): Promise<UserInfoResponse> {
    return await query({path: `/api/account/${username}`})
}

async function login(username: string, password: string): Promise<UserInfoResponse> {
    return await command({username: username, password: password}, {path: `/api/account/${username}`})
}

async function createUser(userInfo: CreateUserRequest): Promise<UserInfoResponse> {
    return await command(userInfo, {
        path: "/api/account",
    })
}

async function joinGroup(group: JoinGroupRequest, userInfo: UserInfo): Promise<Group> {
    return await command(group, {
        path: "/api/conversations/users",
        auth: userInfo
    })
}

async function fetchUserChats(userInfo: UserInfo): Promise<User> {
    return await query({
        path: "/api/conversations",
        auth: userInfo
    })
}

const UserService = {
    fetchUser: getUserInfo,
    registerUser: createUser,
    userJoinGroup: joinGroup,
    fetchConversations: fetchUserChats
}
export default UserService;
