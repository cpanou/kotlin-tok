import styles from "./NavList.module.css"


export default function NavList(props: any) {

    return (
        <div class={styles.links}>
            {props.children}
        </div>
    )

}