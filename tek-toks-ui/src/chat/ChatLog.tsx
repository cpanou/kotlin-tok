import styles from "./ChatLog.module.css"
import {createEffect, createSignal, For} from "solid-js";
import ChatLogEntry from "./ChatLogEntry";
import MessageBar from "./MessageBar";


interface ChatLogProps {
    group: Group
}

export default function ChatLog(props: ChatLogProps) {
    const [scroller, setScroller] = createSignal({} as HTMLElement)
    const [log, setLog] = createSignal({} as HTMLElement)
    const [lastSent, setLastSent] = createSignal(0)

    createEffect(() => {
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

    return (
        <div class={styles.chatContent}>
            <div id="scroll-container" class={styles.chatLogContainer}>
                <div id="chat-log" class={styles.chatLog}>
                    <For each={props.group.messages}>{(msg, i) => {
                        const sentAt = new Date(msg.sentAt * 1000)
                        const minutes = sentAt.getMinutes()
                        const displayTime = sentAt.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes)

                        const entry = lastSent() != (sentAt.getHours() + minutes)
                            ? (<>
                                <div class={styles.time}>
                                    <div class={styles.separator}/>
                                    <span>{displayTime}</span>
                                    <div class={styles.separator}/>
                                </div>
                                <ChatLogEntry message={msg} scrollTo={scrollTo}/>
                            </>)
                            : (<ChatLogEntry message={msg} scrollTo={scrollTo}/>)
                        setLastSent(sentAt.getHours() + minutes)
                        return entry
                    }
                    }</For>
                </div>
            </div>
            <MessageBar></MessageBar>
        </div>
    )
}