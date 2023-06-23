import styles from './FormField.module.css';

interface SubmitProps {
    text: string,
    type: string
}

export default function SubmitButton(props: SubmitProps) {
    return (
        <div class={styles.form__field}>
            <input type={props.type} value={props.text}/>
        </div>
    )
}