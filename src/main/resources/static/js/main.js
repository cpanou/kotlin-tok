function init() {
    state.load()
    auth.resolve()
        .then(userInfo => controller.render(controller.pages.CHAT))
        .catch(e => controller.render(controller.pages.LOGIN))
}

window.onload = init


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
    avatar: {
        selector: () => document.querySelector("#avatar"),
        dropdownActivator: () => document.querySelector(".footer"),
        logout: () => document.querySelector(".footer .signout"),
    },
    conversations: {
        groupChats: () => document.querySelector(".nav-bar .links .groups"),
        privateChats: () => document.querySelector(".nav-bar .links .conversations"),
        initJoin: () => {
            let button = document.querySelector(".thumb.circle");
            button.onclick = () => controller.render(controller.pages.JOIN);
        }
    },
    chatPage: {
        selector: () => document.querySelector(".page.chat"),
        messageForm: () => document.querySelector(".message-bar .chat"),
        messageInput: () => document.getElementById("send-message__input"),
        button: () => document.getElementById("send-message-button"),
        sendMessage: function () {
            let text = controller.chatPage.messageInput().value;
            chatting.sendMessage(text)
            controller.chatPage.messageInput().value = "";
        },
        init: function () {
            api.fetchUserChats()
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
                    const initials = (state.userInfo.firstname[0]) + (state.userInfo.lastname[0]);
                    controller.avatar.selector().innerText = initials.toUpperCase();
                    controller.avatar.selector().onclick = function (e) {
                        controller.avatar.dropdownActivator().classList.toggle("clicked")
                        if (controller.avatar.dropdownActivator().classList.contains("clicked")) {
                            controller.avatar.logout().onclick = auth.logout
                        }
                    }
                    chatSocket.init()
                    controller.conversations.initJoin()
                    chatting.initialize()
                    if (state.groups.length > 0)
                        chatting.activateGroup(state.groups[0])
                })
                .catch(e => {
                    controller.render(controller.pages.JOIN)
                })
        },
    },
    joinChat: {
        selector: () => document.querySelector(".form.join-chat"),
        groupName: () => document.getElementById("joinchat__groupname"),
        backToChat: () => document.getElementById("switch_tok"),
        button: () => document.getElementById("joinchat-button"),
        joinGroup: function () {
            api.joinGroup(controller.joinChat.groupName().value)
                .then(user => state.saveUser(user))
        },
        init: function () {
            controller.joinChat.button().onclick = this.joinGroup;
            controller.joinChat.backToChat().onclick = (e) => controller.render(controller.pages.CHAT);
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
        container: () => document.querySelector(".chat-log-container"),
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
            chatting.chatLog.container().scrollTop = chatting.chatLog.selector().scrollHeight
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
            entry = chatting.chatLog.selector().appendChild(entry)
            chatting.chatLog.container().scrollTop = chatting.chatLog.selector().scrollHeight
        },
    },
    groupConvs: {
        selector: () => document.querySelectorAll(".nav-bar .groups .grp"),
        create: (grp) => {
            let initial = grp.name[0].toUpperCase();
            const grpContainer = document.createElement("div")
            grpContainer.classList.add("grp")
            const grpEntry = document.createElement("div")
            grpEntry.classList.add("thumb")
            grpEntry.innerText = initial
            grpEntry.id = grp.id
            grpEntry.onclick = () => chatting.activateGroup(grp)
            grpContainer.appendChild(grpEntry)
            return grpContainer
        }
    },
    activateGroup: (group) => {
        controller.chatPage.messageInput().value = ""
        chatting.chatLog.selector().innerHTML = ""
        chatting.groupConvs.selector()
            .forEach(grp => {
                let item = grp.querySelector(".thumb")
                grp.classList.remove("active")
                if (item.id === group.id)
                    grp.classList.add("active")
            })
        group.messages.forEach(message => {
            let msg = {
                auth: message.user.username,
                text: message.text
            };
            if (message.user.id === state.userInfo.id)
                chatting.chatLog.createMyEntry(msg)
            else
                chatting.chatLog.createOtherEntry(msg)
        })
    },
    initialize: () => {
        let container = controller.conversations.groupChats();
        container.innerHTML = "";
        state.groups.forEach(grp => {
            container.appendChild(chatting.groupConvs.create(grp))
        });
    },
    sendMessage: (message) => {
        chatting.chatLog.createMyEntry({
            author: state.userInfo.username,
            text: message
        })
        chatSocket.sendMessage(message)

    }
}

chatSocket = {
    socket: undefined,
    timeout: 50,
    exponential: () => {
        if (chatSocket.timeout >= 5000)
            chatSocket.timeout = 50;
        return 2 * chatSocket.timeout
    },
    init: () => {
        const socket = new WebSocket("ws://localhost:8080/message-emitter");
        chatSocket.socket = socket

        socket.addEventListener("open", (event) => {
            socket.send("Hello Server!");
        });
        socket.addEventListener("error", (event) => {
            controller.error(event);
        });
        socket.addEventListener("close", (event) => {
            controller.error(`Connection Lost: ${event}. Reconnecting: ${chatSocket.exponential()}`);
            setTimeout(chatSocket.init, chatSocket.exponential())
            chatSocket.timeout = chatSocket.exponential();
        });
        socket.addEventListener("message", (event) => {
            console.log("Message from server ", event.data);
        });
    },
    sendMessage: (message) => {
        chatSocket.socket.send(JSON.stringify(message))
    }
}