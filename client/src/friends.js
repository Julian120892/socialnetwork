import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    getListOfFriendsAndRequests,
    acceptRequest,
    unfriendFriend,
} from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.friends);
    const requests = useSelector((state) => state.requests);

    useEffect(() => {
        dispatch(getListOfFriendsAndRequests());
    }, []);

    if (!friends || !requests) {
        return null;
    }

    return (
        <>
            <div className="outerContainer">
                <div className="friends-container">
                    <h1 className="title">Requests</h1>
                    {requests.map((result, index) => (
                        <div key={index} className="usersThumbnail">
                            <Link to={`/user/${result.id}`}>
                                <img
                                    className="profile-picture"
                                    src={result.profilepic}
                                />
                                <h2>
                                    {result.first} {""}
                                    {result.last}
                                </h2>
                            </Link>
                            <button
                                id={result.id}
                                onClick={(e) => dispatch(acceptRequest(e))}
                            >
                                Accept
                            </button>
                        </div>
                    ))}
                </div>

                <div className="friends-container">
                    <h1 className="title">Friends</h1>
                    {friends.map((result, index) => (
                        <div key={index} className="usersThumbnail">
                            <Link to={`/user/${result.id}`}>
                                <img
                                    className="profile-picture"
                                    src={result.profilepic}
                                />
                                <h2>
                                    {result.first} {""}
                                    {result.last}
                                </h2>
                            </Link>
                            <button
                                id={result.id}
                                onClick={(e) => dispatch(unfriendFriend(e))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
