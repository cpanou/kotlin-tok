import {JSX} from "solid-js";
import styles from "./Row.module.css";

interface RowProps {
    someprop: string
}

export default function Row(props: RowProps & JSX.HTMLAttributes<HTMLDivElement>) {
    return (
        <div class={styles.row && styles.centered}>
            {props.children}
        </div>
    )
}
