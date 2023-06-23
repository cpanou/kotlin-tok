import styles from './Form.module.css'
import {createSignal} from "solid-js";
import SubmitButton from "./fields/SubmitButton";
import InfoField from "./fields/InfoField";
import {useUserAccessor} from "../../service/AppContext";


export default function GroupJoinForm() {
    const [groupName, setGroupName] = createSignal("");
    const {store, accessor} = useUserAccessor();

    async function onsubmit(e: Event) {
        e.preventDefault()
        accessor.joinGroup({groupName: groupName()})
            .then(grp => console.log("grp is here:", grp))
            .catch(e => console.error(e))
    }

    return (
        <form class={styles.form} onsubmit={onsubmit}>
            <InfoField name="Group" placeholder="Group" onchange={setGroupName}/>
            <SubmitButton type="submit" text="Join In"/>
        </form>
    )
}