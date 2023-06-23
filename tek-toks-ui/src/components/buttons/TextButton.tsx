import styles from "./TextButton.module.css"


interface CircleProps {
    text: string,
    onclick: any
}

export default function TextButton(props: CircleProps & any) {
    return (
        <div class={styles.circle} onclick={props.onclick}>{props.text}</div>
    )
}