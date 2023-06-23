import styles from './Form.module.css'
import UsernameField from "./fields/UsernameField";
import PasswordField from "./fields/PasswordField";
import {createSignal} from "solid-js";
import SubmitButton from "./fields/SubmitButton";
import InfoField from "./fields/InfoField";
import {useUserAccessor} from "../../service/AppContext";


export default function RegisterForm() {
    const [username, setUsername] = createSignal("");
    const [firstname, setFirstname] = createSignal("");
    const [lastname, setLastname] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [passwordConfirmation, setPasswordConfirmation] = createSignal("");
    const {accessor} = useUserAccessor();

    async function onsubmit(e: Event) {
        e.preventDefault()
        accessor.register({
            username: username(),
            firstname: firstname(),
            lastname: lastname(),
        })
            .then(res => console.log(res))
            .catch(e => {
                console.error(e)
            });
    }

    return (
        <form class={styles.form} onsubmit={onsubmit}>
            <UsernameField name="Username" placeholder="Username" onchange={setUsername}/>
            <InfoField name="Firstname" placeholder="Firstname" onchange={setFirstname}/>
            <InfoField name="Lastname" placeholder="Lastname" onchange={setLastname}/>
            <PasswordField name="Password" placeholder="Password" onchange={setPassword}/>
            <PasswordField name="ConfirmPassword" placeholder="Password Confirmation"
                           onchange={setPasswordConfirmation}/>
            <SubmitButton type="submit" text="Sign Up"/>
        </form>
    )
}