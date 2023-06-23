import styles from './Form.module.css'
import UsernameField from "./fields/UsernameField";
import PasswordField from "./fields/PasswordField";
import {createSignal} from "solid-js";
import SubmitButton from "./fields/SubmitButton";
import {useUserAccessor} from "../../service/AppContext";


export default function SignInForm() {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const {accessor} = useUserAccessor();

    async function onsubmit(e: Event) {
        e.preventDefault()
        accessor.login(username(), password())
            .then(res => console.log(res))
            .catch(e => {
                console.error(e)
            });
    }

    return (
        <form class={styles.form} onsubmit={onsubmit}>
            <UsernameField name="Username" placeholder="Username" onchange={setUsername}/>
            <PasswordField name="Password" placeholder="Password" onchange={setPassword}/>
            <SubmitButton type="submit" text="Sign In"/>
        </form>
    )
}