import {JSX} from "solid-js";
import styles from "./Column.module.css";

interface ColumnProps {
    someprop: string
}

export default function Column(props: ColumnProps & JSX.HTMLAttributes<HTMLDivElement>) {
    return (
        <div class={styles.column}>
            {props.children}
        </div>
    )
}
