import styles from "./NavBar.module.css"
import {JSX} from "solid-js";


interface NavBarProps {
    children: JSX.Element[]
}


export default function NavBar(props: NavBarProps) {


    return (
        <div class={styles.navbar}>
            {props.children}
        </div>
    )
}