
const WS_URL = "ws://localhost:8080/message-emitter"; // Replace with your API base URL

function initialise(auth: UserInfo, lifetime: number) : WebSocket {
    cookies.create("sws-usessid", JSON.stringify(auth), lifetime)
    const socket = new WebSocket(WS_URL);
    socket.addEventListener("open", (event) => {
        console.log(event);
        cookies.erase("sws-usessid")
    });
    socket.addEventListener("error", (event) => {
        console.error(event)
    });
    socket.addEventListener("close", (event) => {
        console.log("Closed:", event)
    });
    return socket;
}

function close(socket: WebSocket) {
    socket.close()
}

const cookies = {
    create: function (name: string, value: string, mins: number) {
        let expires = "";
        if (mins) {
            let date = new Date();
            date.setTime(date.getTime() + (mins * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax"
    },
    erase: function (name: string) {
        this.create(name, "", -1);
    }
}

const MessagingService = {
    initializeSocket: initialise,
    closeSocket: close
}

export default MessagingService;
