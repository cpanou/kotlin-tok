interface CreateUserRequest {
    username: string,
    firstname: string,
    lastname: string,
}

interface UserLoginRequest {
    username: string,
    password: string
}

interface FetchUserRequest {
    username: string
}

interface UserInfoResponse {
    userInfo: UserInfo
}

interface UserInfo {
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    createdAt: string,
    lastSeenAt: string,
}

interface Group {
    id: string,
    name: string,
    messages: UserMessage[]
}

interface JoinGroupRequest {
    groupName: string,
}

interface GroupMessage {
    id: string,
    username: string,
    text: string,
    groupId: string,
    sentAt: string,
}

interface UserMessage {
    id: string,
    username: string,
    text: string,
    sentAt: number,
}

interface User {
    userInfo: UserInfo,
    conversations: Conversation[],
    groups: Group[],
}

interface Conversation {
    user: string,
    messages: UserMessage[],
}