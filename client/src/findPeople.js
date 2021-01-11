import { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        let abort;
        console.log("updated view");

        (async () => {
            if (!search) {
                const { data } = await axios.get("/users/most-recent");
                if (!abort) {
                    console.log(data);
                    setResults(data);
                }
            } else {
                const { data } = await axios.get(`/users/search/${search}`);
                if (!abort) {
                    console.log(data);
                    setResults(data);
                }
            }
        })();

        return () => {
            console.log("udate search");
            abort = true;
        };
    }, [search]);

    return (
        <div>
            <input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
            />

            <div>
                {!results.length && search && <li>Nothing Found</li>}
                {results.map((result, index) => (
                    <div key={index} className="usersThumbnail">
                        <img
                            className="profile-picture"
                            src={result.profilepic}
                        />
                        <h2>
                            {result.first}
                            {result.last}
                        </h2>
                        <p>{result.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
