import styles from "./Logo.module.css";
import logoFull from "../logo-full.svg";
import logo from "../logo.svg";


export default function Logo(props: any) {

    const src = !props.type || props.type === "full" ?
        logoFull : logo;

    return (
        <div class={styles.header}>
            <img src={src} class={styles.logo} alt="logo"/>
        </div>
    )
}