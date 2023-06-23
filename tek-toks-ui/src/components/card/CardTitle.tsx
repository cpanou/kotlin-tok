import styles from "./Card.module.css"
import {JSX} from "solid-js";


interface CardTitleProps {
    children: JSX.Element[]
}


export default function CardTitle(props: CardTitleProps) {
    return (
        <div style={styles.cardTitle}>
            {props.children}
        </div>
    )
}