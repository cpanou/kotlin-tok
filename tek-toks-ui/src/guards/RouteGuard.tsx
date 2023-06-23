import {createEffect, createSignal, Show} from "solid-js";
import {useUserAccessor} from "../service/AppContext";
import {Outlet, useNavigate} from "@solidjs/router";
import Logo from "../components/Logo";

export default function RouteGuard(props: any) {
    const navigate = useNavigate();
    const {store, accessor} = useUserAccessor();
    const [loaded, setLoaded] = createSignal(false)

    createEffect(() => {
        if (!!store.authenticated)
            setLoaded(true)

        if (!!store.authenticated && !store.authenticated()) {
            navigate('/signin', {replace: true});
        }

    })

    return (
        <>
            <Show when={loaded()} fallback={<Logo/>}>
                <Outlet/>
            </Show>
        </>
    )
}