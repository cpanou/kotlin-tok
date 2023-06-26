import Container from "../components/panel/Container";
import Column from "../components/panel/Column";
import {JSX} from "solid-js";
import Icon from "../components/icons/Icon";
import GroupJoinForm from "../components/forms/GroupJoinForm";
import Logo from "../components/Logo";
import Card from "../components/card/Card";
import CardTitle from "../components/card/CardTitle";
import CardContent from "../components/card/CardContent";
import {useNavigate} from "@solidjs/router";

interface MyProps {

}

export default function GroupJoinPage(props: MyProps & JSX.HTMLAttributes<HTMLDivElement>) {
    const navigate = useNavigate()
    return (
        <Container name="asdasd">
            <Column someprop="asd">
                <Logo/>
                <Card>
                    <CardTitle>
                        <h3>Join a Group or create a new one</h3>
                        <br/>
                    </CardTitle>
                    <CardContent>
                        <GroupJoinForm onsuccess={() => navigate("/chat")}/>
                        <p class="text--center">
                            <a id="switch_signup" onclick={e => navigate("/chat")}>Resume toking...</a>
                            <Icon icon="#arrow-right"/>
                        </p>
                    </CardContent>
                </Card>
            </Column>
        </Container>
    )
}