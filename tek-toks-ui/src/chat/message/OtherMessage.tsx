import styles from "./Message.module.css"

interface OtherMessageProps {
    message: UserMessage,
}

export default function OtherMessage(props: OtherMessageProps) {

    return (
        <div class={styles.other}>
            <div class={styles.row}>
                {props.message.text}
            </div>
        </div>
    )
}