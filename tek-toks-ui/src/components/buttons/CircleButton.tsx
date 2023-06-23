import styles from "./CircleButton.module.css"


interface CircleProps {
    text: string,
    onclick: any
}

export default function CircleButton(props: CircleProps & any) {
    return (
        <div class={styles.circle} onclick={props.onclick}>{props.text}</div>
    )
}