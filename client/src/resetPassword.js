import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            view: 1,
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

    requestCode() {
        axios
            .post("/password/reset/start", this.state)
            .then((res) => {
                this.setState({
                    error: false,
                    view: 2,
                });
            })
            .catch((err) => {
                console.log("error in requestCode", err);
                this.setState({
                    error: true,
                });
            });
    }

    resetPassword() {
        axios
            .post("/password/reset/verify", this.state)
            .then(() => {
                console.log("updated password");
                this.setState({
                    error: false,
                    view: 3,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        if (this.state.view === 1) {
            return (
                <div className="container">
                    <div className="login">
                        <h3>
                            Please enter your email address with which you
                            registered
                        </h3>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                        {this.state.error && (
                            <span>Something went wrong, please try again.</span>
                        )}
                        <button onClick={() => this.requestCode()}>
                            get Code
                        </button>
                    </div>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <>
                    <div>
                        <h3>Please the Code you recived</h3>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="code"
                            type="text"
                            placeholder="Code"
                            autoComplete="off"
                            required
                        />
                        <h3>Please enter a new password</h3>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="password"
                            type="password"
                            placeholder="new Password"
                            required
                        />
                        {this.state.error && (
                            <span>Something went wrong, please try again.</span>
                        )}
                        <button onClick={() => this.resetPassword()}>
                            reset Password
                        </button>
                    </div>
                </>
            );
        } else if (this.state.view === 3) {
            return (
                <>
                    <div>
                        <h3>Success!</h3>
                        <h3>
                            You can now <Link to="/login">Log In </Link>
                            with your new password
                        </h3>
                    </div>
                </>
            );
        }
    }
}
