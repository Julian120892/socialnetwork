import { Component } from "react";
import axios from "axios";

//1. render 4 input fields, button and error message IF there is one
//2. change handler to get what user types -> store in state
//3. click event handler, send input  to server
//4. handle response from server (failure or sucess)
//      - error -> show message
//      - success -> redirect to / route

export default class Registration extends Component {
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
        let obj = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };

        axios
            .post("/registration", obj)
            .then(() => {
                this.setState({
                    error: false,
                });
                location.replace("/");
            })
            .catch((err) => {
                console.log("error in /registration post request", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                <h2>Registration</h2>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    type="text"
                    placeholder="First Name"
                    required
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    type="text"
                    placeholder="Last Name"
                    required
                />
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
                {this.state.error && (
                    <span>Something went wrong, please try again.</span>
                )}
                <button onClick={() => this.handleClick()}>submit</button>
            </div>
        );
    }
}
