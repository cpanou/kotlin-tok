import styles from './FormField.module.css';
import Icon from "../../icons/Icon";
import {Signal} from "solid-js";


interface FormFieldProps {
    id: string,
    label: string,
    name: string,
    placeholder: string,
    type: string,
    icon: string,
    onchange: (value: string) => void;
}

export default function FormField(props: FormFieldProps) {
    return (
        <div class={styles.form__field}>
            <label for={props.id}>
                <Icon icon={props.icon}/>
                <span class="hidden">{props.label}</span>
            </label>
            <input id={props.id}
                   type={props.type}
                   name={props.name}
                   class={styles.form__input}
                   placeholder={props.placeholder}
                   autocomplete="new-password"
                   onInput={(e) => props.onchange(e.target.value)}
                   required/>
        </div>
    )
}