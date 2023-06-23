import styles from "./Icons.module.css";


interface IconProps {
    icon: string
}

export default function Icon(props: IconProps) {
    return (
        <svg class={styles.icon}>
            <use xmlns:xlink="http://www.w3.org/1999/xlink"
                 xlink:href={props.icon}/>
        </svg>
    )
}