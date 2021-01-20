import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        let abort;

        (async () => {
            if (!search) {
                try {
                    const { data } = await axios.get("/users/most-recent");
                    if (!abort) {
                        setResults(data);
                    }
                } catch (err) {
                    console.log("error in axios most recent users", err);
                }
            } else {
                try {
                    const { data } = await axios.get(`/users/search/${search}`);
                    if (!abort) {
                        setResults(data);
                    }
                } catch (err) {
                    console.log("error in search", err);
                }
            }
        })();

        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <div className="find-container">
            <input
                className="input"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
            />

            <div className="user-container">
                {!results.length && search && <p>Sorry, Nothing Found.</p>}
                {results.map((result, index) => (
                    <div key={index} className="usersThumbnail">
                        <Link to={"user/" + result.id}>
                            <>
                                <div className="thumbnail-picture">
                                    <img
                                        className="profile-picture"
                                        src={result.profilepic}
                                    />
                                </div>

                                <div className="text-container">
                                    <h2>
                                        {result.first} {result.last}
                                    </h2>
                                    <p>{result.bio}</p>
                                </div>
                            </>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
