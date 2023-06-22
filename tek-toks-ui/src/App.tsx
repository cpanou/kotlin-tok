import type {Component} from 'solid-js';
import {HelloWorld} from "./components/helloWorld/HelloWorld";

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    class={styles.link}
                    href="https://github.com/solidjs/solid"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Solid
                </a>
            </header>
            <HelloWorld
            />
            <img src={logo} class={styles.logo} alt="logo"/>
        </div>
    );
};

export default App;
