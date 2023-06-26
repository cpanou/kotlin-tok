import styles from "./MessageBar.module.css"
import {createSignal} from "solid-js";
import SubmitButton from "../components/forms/fields/SubmitButton";
import {useUserAccessor} from "../service/AppContext";


interface MessageBarProps {
    group: Group
}

export default function MessageBar(props: MessageBarProps) {
    const [message, setMessage] = createSignal("")
    const {store, accessor} = useUserAccessor()

    function onSend(e: any) {
        e.preventDefault()
        let msg = message();
        if(!!msg) {
            console.log(msg)
            accessor.sendMessage({
                id: "",
                groupId: props.group.id,
                text: msg,
                username: store.userInfo().username,
                sentAt: 0
            })
            setMessage("")
        }
    }

    return (
        <div class={styles.messageBar}>
            <form class={styles.chatForm} onsubmit={onSend} autocomplete="off">
                <textarea id="sendMessage"
                          name="sendMessage"
                          class={styles.sendMessage}
                          placeholder="Enter you message"
                          autocomplete="off"
                          value={message()}
                          onkeypress={(e) => {
                              if(e.which === 13 && !e.shiftKey) {
                                  e.preventDefault();
                                  onSend(e)
                              }
                          }}
                          onInput={(e) => setMessage(e.target.value)}
                          required/>
                <SubmitButton text={"Send"} type={"submit"}/>
            </form>
        </div>
    )
}