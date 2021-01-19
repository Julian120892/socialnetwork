import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state);

    useEffect(() => {
        // if (chatMessages.message) {
        //     e.target.reset();
        // }
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("messageSend", e.target.value);
            e.target.value = null;
        }
    };

    if (chatMessages.message) {
        return (
            <>
                <h1>This is the Chat</h1>
                {chatMessages.message.map((result, index) => (
                    <div key={index} className="chat-container">
                        <img
                            className="profile-picture"
                            src={result.profilepic}
                        />
                        <p>
                            {result.first} {result.last}
                        </p>
                        <p>{result.timestamp}</p>
                        <h2>{result.messages}</h2>
                    </div>
                ))}

                <textarea onKeyDown={handleKeyDown} />
            </>
        );
    } else {
        return (
            <>
                <h1>Loading last conversation...</h1>
            </>
        );
    }
}
