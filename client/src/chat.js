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
            <div className="chat">
                {chatMessages.message.map((result, index) => (
                    <div key={index} className="chat-container">
                        <div className="metadata-container">
                            {/* <img
                                className="profile-picture"
                                src={result.profilepic}
                            /> */}
                            <div>
                                <h5>
                                    {result.first} {result.last}
                                </h5>
                                <span>{result.timestamp}</span>
                            </div>
                        </div>
                        <div></div>

                        <h2>{result.messages}</h2>
                    </div>
                ))}

                <textarea
                    className="chat-input"
                    onKeyDown={handleKeyDown}
                    placeholder="Send a Message..."
                />
            </div>
        );
    } else {
        return (
            <>
                <h1>Loading last conversation...</h1>
            </>
        );
    }
}
