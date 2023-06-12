window.onload = function (e) {
    //switch
    // loggedIn: (fetchChats)
    //      show chatting page
    // !loggedIn: ()
    //      show login
    // signup: (createUser -> setState)
    //
    init()
        //loggedIn
        .then(userInfo => controller.render(controller.pages.CHAT))
        //not logged In
        .catch(e => controller.render(controller.pages.LOGIN))
}

function init() {
    state.load()
    return auth.resolve()
}

controller = {
    loginPage: {
        selector: () => document.querySelector(".form.login"),
        username: () => document.getElementById("login__username"),
        switchSignup: () => document.getElementById("switch_signup"),
        login: function () {
            return api.userInfo(controller.loginPage.username().value)
                .then(r => r.json())
                .then(res => auth.init(res.userInfo))
                .catch(e => controller.render(controller.pages.LOGIN))
        },
        init: function () {
            controller.loginPage.selector().onsubmit = (e) => {
                e.preventDefault()
                controller.loginPage.login()
            }
            controller.loginPage.switchSignup().onclick = () => controller.render(controller.pages.SIGNUP)
        },
    },
    signupPage: {
        selector: () => document.querySelector(".form.signup"),
        username: () => document.getElementById("signup__username"),
        firstname: () => document.getElementById("signup__firstname"),
        lastname: () => document.getElementById("signup__lastname"),
        switchLogin: () => document.getElementById("switch_login"),
        button: () => document.getElementById("signup-button"),
        register: function () {
            api.createUser({
                username: controller.signupPage.username().value,
                firstname: controller.signupPage.username().value,
                lastname: controller.signupPage.username().value,
            }).then(r => r.json())
                .then(res => auth.init(res.userInfo))
                .catch(e => controller.render(controller.pages.LOGIN))
        },
        init: function () {
            controller.signupPage.selector().onsubmit = (e) => {
                e.preventDefault()
                controller.signupPage.register()
            }
            controller.signupPage.switchLogin().onclick = () => controller.render(controller.pages.LOGIN)
        },
    },
    chatPage: {
        selector: () => document.querySelector(".page.chat"),
        messageInput: () => document.getElementById("send-message__input"),
        button: () => document.getElementById("send-message-button"),
        sendMessage: function () {
            console.log("Sending Message: ", this.messageInput().value)
        },
        init: function () {
            api.fetchUserChats()
                .then(r => r.json())
                .then(user => state.saveUser(user))
                .then(_ => {
                    this.button().onclick = this.sendMessage;
                })
                .catch(e => {
                    console.log(e)
                    controller.render(controller.pages.JOIN)
                })
        },
    },
    joinChat: {
        selector: () => document.querySelector(".form.join-chat"),
        groupName: () => document.getElementById("joinchat__groupname"),
        button: () => document.getElementById("joinchat-button"),
        joinGroup: function () {
            api.joinGroup(this.groupName().value)
                .then(r => r.json())
                .then(user => state.saveUser(user))
        },
        init: function () {
            this.button().onclick = this.sendMessage;
            this.switchLogin().onclick = read(controller.pages.LOGIN)
        },

    },
    pages: {
        JOIN: "JOIN",
        SIGNUP: "SIGNUP",
        CHAT: "CHAT",
        LOGIN: "LOGIN",
    },
    render: function (page) {
        switch (page) {
            case "SIGNUP":
                controller.loginPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.signupPage.selector().classList.remove("hidden")
                controller.signupPage.init()
                break
            case "JOIN":
                controller.loginPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.signupPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.remove("hidden")
                controller.joinChat.init()
                break
            case "CHAT":
                controller.loginPage.selector().classList.add("hidden")
                controller.signupPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.chatPage.selector().classList.remove("hidden")
                controller.chatPage.init()
                break
            case "LOGIN":
            default:
                state.clear()
                controller.signupPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.loginPage.selector().classList.remove("hidden")
                controller.loginPage.init()
        }
    }
}

auth = {
    init: (userInfo) => {
        state.saveUserInfo(userInfo)
    },
    authentication: () => {
        if (!state || !state.userInfo || !state.userInfo.username)
            return new Promise((resolve, reject) => reject("not Logged In"))
        return JSON.stringify(`${state.userInfo}`)
    },
    resolve: function () {
        if (!state || !state.userInfo || !state.userInfo.username)
            return new Promise((resolve, reject) => reject("not Logged In"))
        return api.userInfo(state.userInfo.username)
            .then(response => response.json())
            .then(user => {
                state.saveUserInfo(user.userInfo)
                return user;
            })
            .catch(e => {
                console.log(e)
                throw e
            })
    }
}

state = {
    userInfo: undefined,
    groups: undefined,
    auth: undefined,
    conversations: undefined,
    saveUser: function (user) {
        this.userInfo = user.userInfo
        this.groups = user.groups
        this.conversations = user.conversations
        storage.update()
    },
    clear: function () {
        let st = storage.state()
        this.userInfo = undefined
        st["groups"] = undefined
        this.groups = undefined
        st["groups"] = undefined
        this.conversations = undefined
        st["conversations"] = undefined
        storage.clear()
    },
    load: function () {
        let st = storage.state()
        this.userInfo = st["userInfo"]
        this.groups = st["groups"]
        this.conversations = st["conversations"]
    },
    saveUserInfo: (userInfo) => {
        storage.save("userInfo", userInfo)
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
        let state = JSON.parse(st)
        state[key] = value
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
        sessionStorage.setItem("state", JSON.stringify({"state": undefined}))
    },
    update: () => {
        sessionStorage.removeItem("state");
        sessionStorage.setItem("state", JSON.stringify({"state": state}))
    }
}

api = {
    baseUrl: "http://localhost:8080",
    userInfo: (username) =>
        fetch(`${api.baseUrl}/api/account/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }),
    createUser: (userInfo) =>
        fetch(`${api.baseUrl}/api/account`, {
            method: "POST",
            body: JSON.stringify(userInfo),
            headers: {
                "Content-Type": "application/json"
            }
        }),
    fetchUserChats: () =>
        fetch(`${api.baseUrl}/api/conversations`, {
            headers: {
                "Authorization": auth.authentication(),
                "Content-Type": "application/json"
            }
        }),
    joinGroup: (group) =>
        fetch(`${api.baseUrl}/api/conversations/users`, {
            method: "POST",
            body: JSON.stringify({groupName: group}),
            headers: {
                "Authorization": auth.authentication(),
                "Content-Type": "application/json"
            }
        })

}
