export function reducer(state = {}, action) {
    ///////UNFRIEND BUTTON/////////
    if (action.type == "UNFRIEND") {
        const stayInFriendsList = state.friends.filter((value) => {
            return value.id !== action.data;
        });

        state = {
            ...state,
            friends: stayInFriendsList,
        };
    }

    ///////ACCEPT BUTTON/////////
    if (action.type == "ACCEPT_REQUEST") {
        const stayInRequestList = state.requests.filter((value) => {
            return value.id !== action.data;
        });

        const newFriend = state.requests.filter((value) => {
            return value.id == action.data;
        });

        const addToFriendsList = [newFriend[0], ...state.friends];

        state = {
            ...state,
            requests: stayInRequestList,
            friends: addToFriendsList,
        };
    }

    ///////GET FRIEND LIST/////////
    if (action.type == "GET_FRIENDS_AND_REQUESTS") {
        const friendList = action.data.filter((user) => {
            if (user.accepted == true) {
                return {
                    ...user,
                };
            }
        });
        const requestList = action.data.filter((user) => {
            if (user.accepted == false) {
                return {
                    ...user,
                };
            }
        });

        state = {
            ...state,
            friends: friendList,
            requests: requestList,
        };
    }
    ///////GET MOST RECENT MESSAGES/////////
    if (action.type == "ADD_MOST_RECENT_MESSAGES") {
        console.log("dA in reducer", action.data.reverse());

        state = {
            ...state,
            message: action.data,
        };
    }

    if (action.type == "POST_NEW_MESSAGE") {
        const newMessage = [...state.message, action.data];

        console.log("testststst", newMessage);

        state = {
            ...state,
            message: newMessage,
        };
    }

    console.log(state);

    ///////
    return state;
}
