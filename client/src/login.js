import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () => console.log(this.state)
        );
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then(() => {
                console.log("logged in");
                this.setState({
                    error: false,
                });
                location.replace("/");
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <>
                <h2>Login</h2>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <Link to="/resetPassword">
                    Forgot your password? Click here
                </Link>

                {this.state.error && (
                    <span>Something went wrong, please try again.</span>
                )}
                <button onClick={() => this.handleClick()}>submit</button>
                <Link to="/">Not a user? Register here!</Link>
            </>
        );
    }
}
