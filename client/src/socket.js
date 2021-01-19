import { io } from "socket.io-client";
import { postNewMessage, addMostRecentMessages } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("updateChat", (userAndMessage) =>
        store.dispatch(postNewMessage(userAndMessage))
    );

    socket.on("mostRecentMessages", (dataArr) => {
        store.dispatch(addMostRecentMessages(dataArr));
    });
};
