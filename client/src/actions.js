import axios from "./axios";

export async function getListOfFriendsAndRequests() {
    const { data } = await axios.get("/getListOfFriendsAndRequests");

    return {
        type: "GET_FRIENDS_AND_REQUESTS",
        data: data,
    };
}

export async function acceptRequest(e) {
    const otherUserId = Number(e.target.id);
    await axios.post(`/friends/accept/${otherUserId}`, {
        otherUserId,
    });
    return {
        type: "ACCEPT_REQUEST",
        data: otherUserId,
    };
}

export async function unfriendFriend(e) {
    const otherUserId = Number(e.target.id);
    await axios.post(`/friends/unfriend/${otherUserId}`, {
        otherUserId,
    });
    return {
        type: "UNFRIEND",
        data: otherUserId,
    };
}
