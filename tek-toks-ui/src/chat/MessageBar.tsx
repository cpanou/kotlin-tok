import styles from "./MessageBar.module.css"
import {createSignal} from "solid-js";
import SubmitButton from "../components/forms/fields/SubmitButton";


export default function MessageBar() {
    const [message, setMessage] = createSignal("")

    function onSend(e: any) {
        e.preventDefault()
        console.log(message())
        setMessage("")
    }

    return (
        <div class={styles.messageBar}>
            <form class={styles.chatForm} onsubmit={onSend} autocomplete="off">
                <textarea id="sendMessage"
                       name="sendMessage"
                       class={styles.sendMessage}
                       placeholder="Enter you message here"
                       autocomplete="off"
                       value={message()}
                       onInput={(e) => setMessage(e.target.value)}
                       required/>
                <SubmitButton text={"Send"} type={"submit"}/>
            </form>
        </div>
    )
}