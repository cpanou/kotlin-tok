auth = {
    init: (userInfo) => {
        state.saveUserInfo(userInfo)
    },
    authentication: () => {
        if (!state || !state.userInfo || !state.userInfo.username)
            throw new Error("not Logged In")
        return JSON.stringify(state.userInfo)
    },
    resolve: function () {
        if (!state || !state.userInfo || !state.userInfo.username)
            return new Promise((resolve, reject) => reject("not Logged In"))
        return api.userInfo(state.userInfo.username)
            .then(user => {
                state.saveUserInfo(user.userInfo)
                return user;
            })
    }
}

state = {
    getUser: () => {
        return {
            groups: state.groups,
            userInfo: state.userInfo,
            conversations: state.conversations
        }
    },
    userInfo: undefined,
    groups: undefined,
    auth: undefined,
    conversations: undefined,
    saveUser: function (user) {
        if (!!user.userInfo)
            state.userInfo = user.userInfo
        if (!!user.groups && user.groups.length > 0)
            state.groups = user.groups
        if (!!user.conversations && user.conversations.length > 0)
            state.conversations = user.conversations
        storage.update()
    },
    clear: function () {
        let st = storage.state()
        state.userInfo = undefined
        st["groups"] = undefined
        state.groups = undefined
        st["groups"] = undefined
        state.conversations = undefined
        st["conversations"] = undefined
        storage.clear()
    },
    load: function () {
        let st = storage.state()
        state.userInfo = st["userInfo"]
        state.groups = st["groups"]
        state.conversations = st["conversations"]
    },
    saveUserInfo: (userInfo) => {
        storage.save("userInfo", userInfo)
        state.userInfo = userInfo
    },

}

storage = {
    state: () => {
        let st = sessionStorage.getItem("state");
        if (!st) return {}
        return JSON.parse(st)
    },
    save: (key, value) => {
        let st = sessionStorage.getItem("state");
        if (!st) st = "{}"
        let sta = JSON.parse(st)
        sta[key] = value
        sessionStorage.setItem("state", JSON.stringify(state))
    },
    get: (key) => {
        let st = sessionStorage.getItem("state");
        if (!st) st = "{}"
        let state = JSON.parse(st)
        return state[key]
    },
    clear: () => {
        sessionStorage.removeItem("state");
        sessionStorage.setItem("state", JSON.stringify({}))
    },
    update: () => {
        sessionStorage.removeItem("state");
        sessionStorage.setItem("state", JSON.stringify(state))
    }
}
