import styles from "./GroupItem.module.css"
import {JSX} from "solid-js";


interface GroupItemProps {
    group: Group,
    onclick: any,
    children?: JSX.Element,
    active: boolean,
}


export default function GroupItem(props: GroupItemProps) {
    return (
        <div class={`${styles.grp} ${props.active ? styles.active : ""}`}
             onclick={(e) => props.onclick(props.group)}>
            {props.children}
            <div class={styles.thumb}>{props.group.name[0].toUpperCase()}</div>
        </div>
    )
}