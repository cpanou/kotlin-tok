import {createEffect, Show} from "solid-js";
import MyMessage from "./message/MyMessage";
import OtherMessage from "./message/OtherMessage";
import {useUserAccessor} from "../service/AppContext";
import styles from "./ChatLogEntry.module.css"


interface ChatLogEntryProps {
    message: UserMessage,
    scrollTo: any
}

export default function ChatLogEntry(props: ChatLogEntryProps) {
    const {store} = useUserAccessor()
    const isMine = props.message.username === store.userInfo().username

    createEffect(() => {
        props.scrollTo()
    })

    return (
        <div class={`${styles.entry}  ${isMine ? styles.mine : styles.other}`}>

            <div class={styles.messageContainer}>
                <Show when={isMine} fallback={<OtherMessage message={props.message}/>}>
                    <MyMessage message={props.message}/>
                </Show>
            </div>
        </div>
    )
}