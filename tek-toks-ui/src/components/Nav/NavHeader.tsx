import styles from "./NavHeader.module.css"

export default function NavHeader(props: any) {

    return (
        <div class={styles.header}>
            {props.children}
        </div>
    )

}