import {JSX, Show} from "solid-js";
import styles from "./ChatLogAuthor.module.css"


interface ChatLogAuthorProps {
    message: UserMessage,
    children: JSX.Element,
    showAuthor: boolean
}

export default function ChatLogAuthor(props: ChatLogAuthorProps) {

    function displayTime(message: UserMessage)  {
        let sent = new Date(props.message.sentAt * 1000)
        return sent.getHours() + ":" + (sent.getMinutes() < 10 ? "0" + sent.getMinutes() : sent.getMinutes())
    }


    return (
        <div class={styles.author}>
            <Show when={props.showAuthor}>
                <div class={styles.status}>
                    <div class={styles.name}>
                        {props.message.username}
                    </div>
                    <div class={styles.time}>
                        {displayTime(props.message)}
                    </div>
                </div>
            </Show>
            {props.children}
        </div>
    )
}