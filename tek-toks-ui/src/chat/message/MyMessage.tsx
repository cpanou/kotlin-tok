import styles from "./Message.module.css"


interface MyMessageProps {
    message: UserMessage
}

export default function MyMessage(props: MyMessageProps) {
    return (
        <div class={styles.mine}>
            <div class={styles.row}>
                {props.message.text}
            </div>
        </div>
    )
}