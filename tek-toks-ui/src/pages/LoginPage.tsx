import Container from "../components/panel/Container";
import Column from "../components/panel/Column";
import SignInForm from "../components/forms/SignInForm";
import {JSX} from "solid-js";
import Icon from "../components/icons/Icon";
import Logo from "../components/Logo";
import Card from "../components/card/Card";
import CardTitle from "../components/card/CardTitle";
import CardContent from "../components/card/CardContent";

interface MyProps {

}

export default function LoginPage(props: MyProps & JSX.HTMLAttributes<HTMLDivElement>) {

    return (
        <Container name="asdasd">
            <Column someprop="asd">
                <Logo/>
                <Card>
                    <CardTitle>
                        <h3>Enter your credentials:</h3><br/>
                    </CardTitle>
                    <CardContent>
                        <SignInForm/>
                        <p class="text--center">Not a member? <a id="switch_signup" href="/signup">Sign up now</a>
                            <Icon icon="#arrow-right"/>
                        </p>
                    </CardContent>
                </Card>
            </Column>
        </Container>
    )
}