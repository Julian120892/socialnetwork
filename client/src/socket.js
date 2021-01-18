import io from "socket.io-client";
import { postNewMessage, addMostRecentMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on(
        "updateChat",
        (userAndMessage) => store.dispatch(postNewMessage(userAndMessage)) //create action "postNewMessage"
    );

    socket.on("mostRecentMessages", (dataObj) => {
        store.dispatch(addMostRecentMessages(dataObj));
    });
};
