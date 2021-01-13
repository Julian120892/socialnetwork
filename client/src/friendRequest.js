import { useState, useEffect } from "react";
import axios from "./axios";
import { useLocation } from "react-router-dom";

export default function FriendRequest() {
    let url = useLocation();
    let lastSegment = url.pathname.split("/").pop();

    const [buttonText, setButtonText] = useState();
    const [otherUserId, setOtherUserId] = useState(lastSegment);

    //on Click wird button text geupdated, aber data
    //in useEffect() bleibt leer. Deswegen funktionert
    //direkt der nächste Click nicht, da er keine daten hat

    useEffect(() => {
        console.log("updating render");
        axios
            .get(`/friendship-status/${otherUserId}`, {
                params: { otherUserId },
            })
            .then(({ data }) => {
                const text = friendshiptStatusToButtonText(data, otherUserId);
                setButtonText(text);
            });
    }, [otherUserId]);

    const handleClick = () => {
        console.log("clicked", buttonText);
        axios
            .post(`/friendship-status/update/${otherUserId}`, {
                otherUserId,
                buttonText,
            })
            .then(({ data }) => {
                console.log("data ", data);
                setOtherUserId(data.otherUserId);
                console.log(data.otherUserId);
                setButtonText(data.newStatus);
            });
    };

    return (
        <>
            <button onClick={handleClick}>{buttonText}</button>
            <span>{otherUserId}</span>
        </>
    );
}

let friendshiptStatusToButtonText = function (status, otherUserId) {
    if (!status[0]) {
        return "add as Friend";
    }

    if (status[0].sender_id == otherUserId) {
        if (status[0].accepted == true) {
            return "Unfriend";
        } else if (status[0].accepted == false) {
            return "accept Request";
        }
    } else {
        if (status[0].accepted == true) {
            return "Unfriend";
        } else if (status[0].accepted == false) {
            return "cancel request";
        }
    }
};
