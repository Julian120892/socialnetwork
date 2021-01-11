import { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        let abort;
        console.log(results);

        (async () => {
            const { data } = await axios.get(`/users/search/${search}`);

            if (!abort) {
                // console.log("data from request", data);
                setResults(data);
                console.log("results in function", results);
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
            <ul>
                {!results.length && search && <li>Nothing Found</li>}
                {/* {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))} */}
            </ul>
        </div>
    );
}
