import Container from "../components/panel/Container";
import Column from "../components/panel/Column";
import {JSX} from "solid-js";
import styles from "../App.module.css";
import Icon from "../components/icons/Icon";
import RegisterForm from "../components/forms/RegisterForm";
import Logo from "../components/Logo";
import Card from "../components/card/Card";
import CardTitle from "../components/card/CardTitle";
import CardContent from "../components/card/CardContent";

interface MyProps {

}

export default function LoginPage(props: MyProps & JSX.HTMLAttributes<HTMLDivElement>) {


    return (
        <Container name="asdasd" class={styles.header}>
            <Column someprop="asd">
                <Logo/>
                <Card>
                    <CardTitle>
                        <h3>Enter your information:</h3><br/>
                    </CardTitle>
                    <CardContent>
                        <RegisterForm/>
                        <p class="text--center">Already a member? <a id="switch_signup" href="/signin">Sign In</a>
                            <Icon icon="#arrow-right"/>
                        </p>
                    </CardContent>
                </Card>
            </Column>
        </Container>
    )
}