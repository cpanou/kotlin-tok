import FormField from "./FormField";


interface UsernameFieldProps {
    name: string,
    placeholder: string,
    onchange: any,
}

export default function UsernameField(props: UsernameFieldProps) {
    return (
        <FormField id={props.name}
                   label=""
                   name={props.name}
                   placeholder={props.placeholder}
                   onchange={props.onchange}
                   type="text" icon="#user"/>
    )
}