import FormField from "./FormField";


interface InfoFieldProps {
    name: string,
    placeholder: string,
    onchange: any
}

export default function InfoField(props: InfoFieldProps) {
    return (
        <FormField id={props.name}
                   label=""
                   name={props.name}
                   onchange={props.onchange}
                   placeholder={props.placeholder}
                   type="text" icon="#arrow-right"/>
    )
}