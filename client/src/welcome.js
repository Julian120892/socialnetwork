import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default function Welcome() {
    return (
        <div className="container">
            <img className="welcome-logo" src="/logo.png" alt="Logo" />
            <h1>welcome to social network</h1>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetPassword" component={ResetPassword} />
                </>
            </HashRouter>
        </div>
    );
}
