import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editModeVisible: false,
            userBioOnScreen: true,
            error: false,
        };
    }

    handleChange(e) {
        //make var for bio content
        this.setState(
            {
                draftBio: e.target.value,
            }
            // () => console.log(this.state)
        );
    }

    saveBio() {
        console.log("clicked");
        axios
            .post("/updateBio", this.state)
            .then((res) => {
                console.log(res.data.bio);
                this.props.updateProfile(res.data.bio);
                this.toggleTextArea();
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    error: true,
                });
            });
        //needs to arlarm app to update App, like profilePic
    }

    toggleTextArea() {
        this.setState({
            editModeVisible: !this.state.editModeVisible,
            userBioOnScreen: !this.state.userBioOnScreen,
        });
    }

    render() {
        return (
            <>
                {!this.state.editModeVisible && (
                    <>
                        {this.state.userBioOnScreen && <p>{this.props.bio}</p>}

                        {this.props.bio && (
                            <button onClick={() => this.toggleTextArea()}>
                                edit bio
                            </button>
                        )}
                        {!this.props.bio && (
                            <button onClick={() => this.toggleTextArea()}>
                                add
                            </button>
                        )}
                    </>
                )}

                <br />

                {this.state.editModeVisible && (
                    <>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            defaultValue={this.props.bio}
                        />
                        {this.state.error && (
                            <span>Something went wrong, please try again.</span>
                        )}
                        <br />
                        <button onClick={() => this.saveBio()}>Save</button>
                    </>
                )}
            </>
        );
    }
}

//if bio display bio with update button
//else display edit button
//both buttons go to edit mode

//button displays Edit or Add
//on Edit prepopulate textarea with {bio}
