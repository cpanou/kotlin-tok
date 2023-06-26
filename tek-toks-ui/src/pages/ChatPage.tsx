import NavBar from "../components/Nav/NavBar";
import FullPage from "../components/page/FullPage";
import NavHeader from "../components/Nav/NavHeader";
import Logo from "../components/Logo";
import CircleButton from "../components/buttons/CircleButton";
import NavList from "../components/Nav/NavList";
import NavFooter from "../components/Nav/NavFooter";
import AccountDropdown from "../components/dropdown/AccountDropdown";
import styles from "../components/Nav/NavBar.module.css";
import {useUserAccessor} from "../service/AppContext";
import {useNavigate} from "@solidjs/router";
import {createEffect, createSignal, For} from "solid-js";
import GroupItem from "../chat/GroupItem";
import ChatLog from "../chat/ChatLog";


export default function ChatPage() {
    const [userInitials, setUserInitials] = createSignal("AA")
    const [activeGroup, setActiveGroup] = createSignal({id: "-1234"} as Group)
    const {store, accessor} = useUserAccessor();
    const navigate = useNavigate()

    function joinGroup(e: Event) {
        navigate("/group", {replace: true})
    }

    function activateGroup(grp: Group) {
        setActiveGroup(grp)
    }

    createEffect((prevUser) => {
        const userInfo = store.userInfo()
        if (!(store.authenticated && store.authenticated()))
            return

        let initials = userInfo.firstname[0] + userInfo.lastname[0]
        setUserInitials(initials.toUpperCase())
    }, store.userInfo())

    createEffect((prevGroups) => {
        if (!(store.authenticated && store.authenticated()))
            return
        if (store.groups().length > 0) {
            activateGroup(store.groups()[0])
        } else {
            accessor.getUser()
                .then(u => {
                    if (!!u.groups && u.groups.length <= 0) {
                        navigate("/group")
                    }
                }).catch(e => navigate("/group"))
        }
    }, store.groups())

    createEffect((prev) => {
        if (!(store.authenticated && store.authenticated()))
            return
        const message = store.messagingStream();
        let tempGrp = store.groups().find(grp => message.groupId === grp.id);
        if (message.groupId === activeGroup().id && !!tempGrp) {
            activateGroup(tempGrp)
        }
    }, store.messagingStream())

    return (
        <FullPage>
            <NavBar>
                <NavHeader>
                    <Logo type="simple"/>
                </NavHeader>
                <CircleButton text="+" onclick={joinGroup}/>
                <NavList>
                    <For each={store.groups()}>{(grp, i) =>
                        <GroupItem group={grp} onclick={(e: Event) => activateGroup(grp)}
                                   active={grp.id === activeGroup().id}/>
                    }</For>
                </NavList>
                <NavFooter>
                    <AccountDropdown activator={<CircleButton text={userInitials()}/>}>
                        <p>Hello <span>{store.userInfo().firstname}!</span></p>
                        <div class={styles.signout} onclick={accessor.logout}>
                            Sign Out
                        </div>
                    </AccountDropdown>
                </NavFooter>
            </NavBar>
            <ChatLog group={activeGroup()}/>
        </FullPage>
    )
}