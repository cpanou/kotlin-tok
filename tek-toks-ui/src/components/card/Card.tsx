import styles from "./Card.module.css"
import {JSX} from "solid-js";


interface CardProps {
    children: JSX.Element[]
}


export default function Card(props: CardProps) {
    return (
        <div class={styles.card}>
            {props.children}
        </div>
    )
}