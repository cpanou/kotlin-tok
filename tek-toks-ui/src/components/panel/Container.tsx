import {JSX} from "solid-js";
import styles from "./Container.module.css"

interface GridProps {
    name: string
}

export default function Container(props: GridProps & JSX.HTMLAttributes<HTMLDivElement>) {
    return (
        <div class={styles.container}>
            {props.children}
        </div>
    )
}