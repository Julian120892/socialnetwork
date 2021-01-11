import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";
import { Link } from "react-router-dom";
import FindPeople from "./findPeople";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            profilepic:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC",
        };
        this.setProfilepic = this.setProfilepic.bind(this);
        this.updateProfile = this.updateProfile.bind(this);

        this.toggleUploader = this.toggleUploader.bind(this);
    }

    componentDidMount() {
        console.log("App mounted");
        axios.get("/userData").then((res) => {
            this.setState({
                first: res.data.first,
                last: res.data.last,
                email: res.data.email,
                bio: res.data.bio,
            });

            if (res.data.profilepic != null) {
                this.setState({
                    profilepic: res.data.profilepic,
                });
            }
        });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setProfilepic(url) {
        this.setState({
            profilepic: url,
        });
    }

    updateProfile(updatedBio) {
        console.log("update Profile", updatedBio);
        this.setState({
            bio: updatedBio,
        });
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <header>
                        <a className="logo" href="#">
                            <img src="" alt="Logo" />
                        </a>
                        <nav>
                            <ul>
                                <a href="#">
                                    <li>Test Link</li>
                                </a>
                            </ul>
                        </nav>

                        <Link to="/">
                            <ProfilePic
                                profilepic={this.state.profilepic}
                                // toggleUploader={this.toggleUploader}
                            />
                        </Link>
                    </header>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div className="component">
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                    profilepic={this.state.profilepic}
                                    toggleUploader={this.toggleUploader}
                                    updateProfile={this.updateProfile}
                                />
                            </div>
                        )}
                    />

                    <Route
                        path="/users"
                        render={() => (
                            <div className="component">
                                <FindPeople />
                            </div>
                        )}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <div className="component">
                                <OtherProfile
                                    match={props.match}
                                    key={props.match.url}
                                    history={props.history}
                                />
                            </div>
                        )}
                    />

                    {this.state.uploaderIsVisible && (
                        <div className="component">
                            <Uploader
                                setProfilepic={this.setProfilepic}
                                toggleUploader={this.toggleUploader}
                            />
                        </div>
                    )}
                </BrowserRouter>
            </>
        );
    }
}
