import styles from "./NavFooter.module.css"

export default function NavFooter(props: any) {

    return (
        <div class={styles.footer}>
            {props.children}
        </div>
    )

}