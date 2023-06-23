import styles from "./Card.module.css";
import {JSX} from "solid-js";


interface CardContentProps {
    children: JSX.Element[]
}

export default function CardContent(props: CardContentProps) {
    return (
        <div style={styles.cardContent}>
            {props.children}
        </div>
    )
}