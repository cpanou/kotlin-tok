import styles from "./FullPage.module.css"


export default function FullPage(props: any) {

    return(
        <div class={styles.fullContainer}>
            {props.children}
        </div>
    )
}