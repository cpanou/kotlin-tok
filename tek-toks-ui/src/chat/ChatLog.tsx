import styles from "./ChatLog.module.css"
import {createEffect, createMemo, createSignal, For, onMount} from "solid-js";
import ChatLogEntry from "./ChatLogEntry";
import MessageBar from "./MessageBar";


interface ChatLogProps {
    group: Group
}

export default function ChatLog(props: ChatLogProps) {
    const [scroller, setScroller] = createSignal({} as HTMLElement)
    const [log, setLog] = createSignal({} as HTMLElement)
    const [lastSent, setLastSent] = createSignal({} as Date)

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

    const messages  = createMemo(() => props.group.messages)

    return (
        <div class={styles.chatContent}>
            <div id="scroll-container" class={styles.chatLogContainer}>
                <div id="chat-log" class={styles.chatLog}>
                    <For each={messages()}>{(msg, i) => {
                        if (i() == 0)
                            setLastSent(new Date(msg.sentAt))
                        const sentAt = new Date(msg.sentAt * 1000)
                        const minutes = sentAt.getMinutes()
                        const displayTime = sentAt.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes)

                        const minutesDiff = (lastSent().getHours() + lastSent().getMinutes()) - (sentAt.getHours() + minutes)
                        const timestamp = minutesDiff > 15 ? displayTime : undefined

                        const entry = !!timestamp
                            ? (<>
                                <div class={styles.time}>
                                    <div class={styles.separator}/>
                                    <span>{timestamp}</span>
                                    <div class={styles.separator}/>
                                </div>
                                <ChatLogEntry message={msg} scrollTo={scrollTo} timestamp={timestamp}/>
                            </>)
                            : (<ChatLogEntry message={msg} scrollTo={scrollTo} timestamp={timestamp}/>)

                        setLastSent(sentAt)
                        return entry
                    }}</For>
                </div>
            </div>
            <MessageBar group={props.group}></MessageBar>
        </div>
    )
}