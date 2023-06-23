import type {Component} from 'solid-js';
import styles from './App.module.css';
import {Icons} from "./components/icons/Icons";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import {Route, Router, Routes} from "@solidjs/router";
import GroupJoinPage from "./pages/GroupJoinPage";
import RouteGuard from "./guards/RouteGuard";
import PublicRouteGuard from "./guards/PublicRouteGuard";

const App: Component = () => {

    return (
        <div class={styles.App}>
            <Icons/>
            <Router>
                <Routes>
                    <Route path="/signin" component={PublicRouteGuard}>
                        <Route path="*" component={LoginPage}/>
                    </Route>
                    <Route path="/signup" component={PublicRouteGuard}>
                        <Route path="*" component={RegisterPage}/>
                    </Route>

                    <Route path="/group" component={RouteGuard}>
                        <Route path="*" component={GroupJoinPage}/>
                    </Route>
                    <Route path="/chat" component={RouteGuard}>
                        <Route path="*" component={ChatPage}/>
                    </Route>
                    <Route path="/" component={RouteGuard}>
                        <Route path="*" component={ChatPage}/>
                    </Route>
                    <Route path="*" component={RouteGuard}>
                        <Route path="*" component={ChatPage}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
