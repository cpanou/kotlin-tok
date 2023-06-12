window.onload = function (e) {
    state.load()
    auth.resolve()
        .then(userInfo => controller.render(controller.pages.CHAT))
        .catch(e => controller.render(controller.pages.LOGIN))
}


controller = {
    error: (error) => {
        console.log(error)
        let alert = document.querySelector("div.alert")
        let alertText = document.querySelector(".alert .alert-text")

        let text = "Something went Wrong!"
        if (!!error["message"])
            text = error["message"]
        else if (!!error["errorDescription"])
            text = error["errorDescription"]
        else if (!!error["error"])
            text = error["error"]
        else if (typeof error == "string")
            text = error

        alertText.innerText = text

        alert.classList.remove("hidden")
        alert.classList.add("error")
        setTimeout(() => {
            alert.classList.add("hidden")
            alert.classList.remove("error")
        }, 3000)
    },
    setupContainer: {
        selector: () => document.querySelector(".align.body"),
    },
    loginPage: {
        selector: () => document.querySelector(".form.login"),
        username: () => document.getElementById("login__username"),
        switchSignup: () => document.getElementById("switch_signup"),
        login: function () {
            return api.userInfo(controller.loginPage.username().value)
                .then(res => auth.init(res.userInfo))
                .then(_ => controller.render(controller.pages.CHAT))
                .catch(e => {
                    controller.error(e)
                    controller.render(controller.pages.LOGIN)
                })
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
            })
                .then(res => auth.init(res.userInfo))
                .then(_ => controller.render(controller.pages.CHAT))
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
        messageForm: () => document.querySelector(".message-bar .chat"),
        messageInput: () => document.getElementById("send-message__input"),
        button: () => document.getElementById("send-message-button"),
        sendMessage: function () {
            let text = controller.chatPage.messageInput().value;
            console.log("Sending Message: ", text)
            chatting.sendMessage(text)
            controller.chatPage.messageInput().value = "";
        },
        init: function () {
            new Promise((resolve, reject) => {
                if (!!state && !!state.groups && state.groups.length > 0) {
                    resolve(state.getUser())
                } else {
                    console.log("No User Chats...")
                    reject("No User Chats...")
                }
            }).catch(e => api.fetchUserChats())
                .then(user => {
                    if (!!user && !!user.groups && user.groups.length > 0) {
                        state.saveUser(user)
                        return user
                    } else throw new Error("No User Chats...")
                })
                .then(_ => {
                    controller.chatPage.messageForm().onsubmit = (e) => {
                        e.preventDefault()
                        controller.chatPage.sendMessage();
                    }
                })
                .catch(e => {
                    controller.render(controller.pages.JOIN)
                })
        },
    },
    joinChat: {
        selector: () => document.querySelector(".form.join-chat"),
        groupName: () => document.getElementById("joinchat__groupname"),
        button: () => document.getElementById("joinchat-button"),
        joinGroup: function () {
            api.joinGroup(controller.joinChat.groupName().value)
                .then(user => state.saveUser(user))
        },
        init: function () {
            controller.joinChat.button().onclick = this.joinGroup;
        },
    },
    pages: {
        JOIN: "JOIN",
        SIGNUP: "SIGNUP",
        CHAT: "CHAT",
        LOGIN: "LOGIN",
    },
    render: function (page) {
        console.log(`Navigation To: ${page}`)
        switch (page) {
            case "SIGNUP":
                controller.setupContainer.selector().classList.remove("hidden")
                controller.loginPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.signupPage.selector().classList.remove("hidden")
                controller.signupPage.init()
                break
            case "JOIN":
                controller.setupContainer.selector().classList.remove("hidden")
                controller.loginPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.signupPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.remove("hidden")
                controller.joinChat.init()
                break
            case "CHAT":
                controller.setupContainer.selector().classList.add("hidden")
                controller.loginPage.selector().classList.add("hidden")
                controller.signupPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.chatPage.selector().classList.remove("hidden")
                controller.chatPage.init()
                break
            case "LOGIN":
            default:
                state.clear()
                controller.setupContainer.selector().classList.remove("hidden")
                controller.signupPage.selector().classList.add("hidden")
                controller.chatPage.selector().classList.add("hidden")
                controller.joinChat.selector().classList.add("hidden")
                controller.loginPage.selector().classList.remove("hidden")
                controller.loginPage.init()
        }
    }
}

chatting = {
    chatLog: {
        selector: () => document.querySelector(".chat-log"),
        createMyEntry: (message) => {
            let entry = document.createElement("div")
            entry.classList.add("entry", "mine")
            let container = document.createElement("div")
            container.classList.add("message-container")
            let messageDiv = document.createElement("div")
            messageDiv.classList.add("message")
            messageDiv.innerText = message.text;
            container.appendChild(messageDiv)
            entry.appendChild(container)
            chatting.chatLog.selector().appendChild(entry)
        },
        createOtherEntry: (message) => {
            let entry = document.createElement("div")
            entry.classList.add("entry", "other")
            let container = document.createElement("div")
            container.classList.add("message-container")
            let author = document.createElement("div")
            author.classList.add("author")
            let messageDiv = document.createElement("div")
            messageDiv.classList.add("message")
            messageDiv.innerText = message.text;
            container.appendChild(author)
            container.appendChild(messageDiv)
            entry.appendChild(container)
            chatting.chatLog.selector().appendChild(entry)
        },
    },
    sendMessage: (message) => {
        chatting.chatLog.createMyEntry({
            author: state.userInfo.username,
            text: message
        })

    }
}