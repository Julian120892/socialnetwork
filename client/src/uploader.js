import { Component } from "react";
import axios from "./axios";

export default class uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleClick() {
        let formData = new FormData();
        formData.append("image", this.state.undefined);
        this.add = null;
        this.pending = 1;

        axios
            .post("/upload", formData)
            .then((res) => {
                this.props.toggleUploader();
                this.props.setProfilepic(res.data[0].profilepic);
            })
            .catch((err) => {
                console.log("error in axios upload ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleFileChange(e) {
        console.log("file changed");
        this.setState({
            [this.state.image]: e.target.files[0],
        });
    }

    render() {
        return (
            <>
                <div>
                    <p onClick={() => this.props.toggleUploader()}>close</p>
                    <h1>uploader</h1>
                    <input
                        onChange={(e) => this.handleFileChange(e)}
                        type="file"
                        name="profilepic"
                        accept="image/*"
                    />
                    {this.state.error && (
                        <span>Something went wrong, please try again.</span>
                    )}
                    <button onClick={() => this.handleClick()}>upload</button>
                </div>
            </>
        );
    }
}
