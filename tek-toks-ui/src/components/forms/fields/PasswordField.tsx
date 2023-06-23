import FormField from "./FormField";


interface PasswordFieldProps {
    name: string,
    placeholder: string,
    onchange: any,
}

export default function PasswordField(props: PasswordFieldProps) {
    return (
        <FormField id={props.name}
                   label=""
                   onchange={props.onchange}
                   name={props.name}
                   placeholder={props.placeholder}
                   type="password" icon="#lock"/>
    )
}