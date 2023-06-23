import {createSignal, JSX, Show} from "solid-js";
import styles from "./AccountDropdown.module.css"

interface DropdownProps {
    activator: JSX.Element;
    children: JSX.Element;
}

export default function AccountDropdown(props: DropdownProps) {
    const [isOpen, setIsOpen] = createSignal(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen());
    };

    return (
        <div class={styles.dropdown} onClick={toggleDropdown}>
            {props.activator}
            <Show when={isOpen()}>
                <div class={styles.dropdownContent}>
                    {props.children}
                </div>
            </Show>
        </div>
    );
};