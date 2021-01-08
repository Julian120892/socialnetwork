import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    componentDidMount() {
        axios
            .get("/user/:id/getUserData", {
                params: { id: this.props.match.params.id },
            })
            .then((res) => {
                if (res.data.first) {
                    this.setState({
                        first: res.data.first,
                        last: res.data.last,
                        bio: res.data.bio,
                        profilepic: res.data.profilepic,
                        currentId: res.data.currentId,
                    });
                    if (this.props.match.params.id == this.state.currentId) {
                        this.props.history.push("/");
                    }
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    render() {
        if (this.state.error) {
            return <h1>No match found.</h1>;
        } else {
            return (
                <div className="profile-page">
                    <img
                        className="profile-picture"
                        src={this.state.profilepic}
                        alt="other user profile Picture"
                    />
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <p>{this.state.bio}</p>
                </div>
            );
        }
    }
}
