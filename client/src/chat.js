import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    //1.retrive chat messages
    const chatMessages = useSelector((state) => state && state.chatMessages);
    //2. post new messages

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("user pressed enter key.");
            //send message to server via emit
            socket.emit("messageSend", e.target.value);
        }
    };

    return (
        <>
            <h1>This is the Chat</h1>
            <div className="chat-container">
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
                <p>dummy message...</p>
            </div>
            <textarea onKeyDown={handleKeyDown} />
        </>
    );
}
