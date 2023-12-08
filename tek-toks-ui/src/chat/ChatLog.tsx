import styles from "./ChatLog.module.css"
import {createMemo, createSignal, For, onMount} from "solid-js";
import ChatLogEntry from "./ChatLogEntry";
import MessageBar from "./MessageBar";
import ChatLogAuthor from "./ChatLogAuthor";


interface ChatLogProps {
    group: Group
}

function daysSeparator(lastShown: () => boolean[], daysDiff: number) {
    let shown = lastShown()
    let timestamp = undefined;
    let show = false;

    if (daysDiff > 30) {
        timestamp = "Before this month";
        if (!shown[0]) {
            shown[0] = true;
            show = true;
        }
    } else if (daysDiff >= 7) {
        timestamp = "Before this week"
        if (!shown[1]) {
            shown[1] = true;
            show = true;
        }
    } else if (daysDiff >= 3) {
        timestamp = "Older this week"
        if (!shown[2]) {
            shown[2] = true;
            show = true;
        }
    } else if (daysDiff >= 2) {
        timestamp = "Yesterday"
        if (!shown[3]) {
            shown[3] = true;
            show = true;
        }
    } else {
        timestamp = "Today"
        if (!shown[4]) {
            shown[4] = true;
            show = true;
        }
    }
    return {shown, timestamp, show};
}

export default function ChatLog(props: ChatLogProps) {
    const [scroller, setScroller] = createSignal({} as HTMLElement)
    const [log, setLog] = createSignal({} as HTMLElement)

    const [lastShown, setLastShown] = createSignal([false, false, false, false, false])
    const [lastSender, setLastSender] = createSignal("")


    onMount(() => {
        let elem = document.getElementById("scroll-container")
        if (!!elem) {
            setScroller(elem)
        }
        let chatLog = document.getElementById("chat-log")
        if (!!chatLog) {
            setLog(chatLog)
        }
    })

    function scrollTo() {
        scroller().scrollTop = log().scrollHeight;
    }

    const messages = createMemo(() => !!props.group ? props.group.messages : [])

    return (
        <div class={styles.chatContent}>
            <div id="scroll-container" class={styles.chatLogContainer}>
                <div id="chat-log" class={styles.chatLog}>
                    <For each={messages()}>{(msg, i) => {

                        const diff = (new Date().getTime() - msg.sentAt * 1000);
                        const daysDiff = ((diff / 1000 / 60) / 60) / 24
                        let {shown, timestamp, show} = daysSeparator(lastShown, daysDiff);

                        const sender = (msg.username === lastSender()) ? undefined : msg.username;

                        const entry = show
                            ? (<>
                                <div class={styles.time}>
                                    <div class={styles.separator}/>
                                    <span>{timestamp}</span>
                                    <div class={styles.separator}/>
                                </div>
                                <ChatLogAuthor message={msg} showAuthor={!!sender}>
                                    <ChatLogEntry message={msg} scrollTo={scrollTo}/>
                                </ChatLogAuthor>
                            </>)
                            : (
                                <ChatLogAuthor message={msg} showAuthor={!!sender}>
                                    <ChatLogEntry message={msg} scrollTo={scrollTo}/>
                                </ChatLogAuthor>
                            )

                        setLastShown(shown)
                        setLastSender(msg.username)
                        return entry
                    }}</For>
                </div>
            </div>
            <MessageBar group={props.group}></MessageBar>
        </div>
    )
}