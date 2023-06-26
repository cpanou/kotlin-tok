import styles from "./ChatLog.module.css"
import {createMemo, createSignal, For, onMount} from "solid-js";
import ChatLogEntry from "./ChatLogEntry";
import MessageBar from "./MessageBar";


interface ChatLogProps {
    group: Group
}

export default function ChatLog(props: ChatLogProps) {
    const [scroller, setScroller] = createSignal({} as HTMLElement)
    const [log, setLog] = createSignal({} as HTMLElement)
    const [lastSent, setLastSent] = createSignal(0)
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

    const messages = createMemo(() => props.group.messages)

    return (
        <div class={styles.chatContent}>
            <div id="scroll-container" class={styles.chatLogContainer}>
                <div id="chat-log" class={styles.chatLog}>
                    <For each={messages()}>{(msg, i) => {
                        const sentAt = new Date(msg.sentAt * 1000)
                        const minutes = sentAt.getMinutes()
                        const minutesDiff = ((msg.sentAt) - (lastSent())) / 60
                        const displayTime = sentAt.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes)

                        const timestamp = minutesDiff > 15 ? displayTime : undefined
                        const sender = (msg.username === lastSender()) ? undefined : msg.username

                        const entry = !!timestamp
                            ? (<>
                                <div class={styles.time}>
                                    <div class={styles.separator}/>
                                    <span>{timestamp}</span>
                                    <div class={styles.separator}/>
                                </div>
                                <ChatLogEntry message={msg} scrollTo={scrollTo} timestamp={sender}/>
                            </>)
                            : (<ChatLogEntry message={msg} scrollTo={scrollTo} timestamp={sender}/>)

                        if (!!timestamp) setLastSent(msg.sentAt)
                        setLastSender(msg.username)
                        return entry
                    }}</For>
                </div>
            </div>
            <MessageBar group={props.group}></MessageBar>
        </div>
    )
}