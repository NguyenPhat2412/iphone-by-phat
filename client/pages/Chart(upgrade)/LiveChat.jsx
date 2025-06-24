import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  withCredentials: true,
}); // Adjust the URL as needed

const LiveChat = ({ isOpen }) => {
  // Local storage key for rooms
  const [roomId, setRoomId] = useState(localStorage.getItem("rooms") || "");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // const sendMessage = () => {
  //   if (!input.trim()) return;
  //   setMessages([...messages, { text: input, sender: "user" }]);
  //   setInput("");

  //   // Gia lap phan hoi tu bot
  //   setTimeout(() => {
  //     setMessages(
  //       (prevMessages) => [
  //         ...prevMessages,
  //         { text: "Bot: " + input, sender: "bot" },
  //       ],
  //       1000
  //     );
  //   });
  // };

  useEffect(() => {
    console.log("Connect to socket: ", socket.connected);
    const handleRoomCreated = ({ roomId }) => {
      localStorage.setItem("rooms", roomId);
      setRoomId(roomId);
    };

    const handleNewMessage = (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    const handleChatEnded = () => {
      alert("Chat has ended. You can start a new chat.");
      setMessages([]);
      localStorage.removeItem("rooms");
      setRoomId(null);
    };
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    socket.on("room_created", handleRoomCreated);
    socket.on("new_message", handleNewMessage);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("room_created", handleRoomCreated);
      socket.off("new_message", handleNewMessage);
      socket.off("chat_ended", handleChatEnded);
      socket.off("connect_error", (err) => {
        console.error("❌ Socket connect error:", err.message);
      });
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    if (!socket.connected) {
      console.error("Socket not connected yet");
      return;
    }

    socket.emit("client_message", {
      roomId: roomId,
      message: input,
    });
    console.log("Message sent:", input);

    // Clear input field after sending
    setInput("");
  };

  return (
    <div
      className={`fixed bottom-30 right-10 w-100 bg-white shadow-lg rounded-lg transition ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
      }`}
    >
      <div>
        <div className="flex justify-between pt-3 px-3 rounded-lg">
          <div className="p-1 font-bold">Customer Support</div>
          <div>
            <div
              className="p-1 px-2
           text-sm text-gray-500 bg-gray-100"
              style={{ margin: "5px" }}
            >{`Let's Chat App`}</div>
          </div>
        </div>
        <div className="p-3 h-60 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg text-sm ${
                msg.sender === "client"
                  ? "bg-blue-100 text-right"
                  : msg.sender === "bot"
                  ? "bg-gray-200 text-left italic"
                  : msg.sender === "admin"
                  ? "bg-yellow-100 text-left"
                  : "bg-gray-200 text-left"
              }, `}
            >
              {msg.sender === "client"
                ? `You: ${msg.message}`
                : msg.sender === "bot"
                ? `${msg.message}`
                : `Admin: ${msg.message}`}
            </div>
          ))}
        </div>
        <div className="p-2 border-t flex bg-gray-100">
          <input
            className="flex-1 p-2 bg-white rounded-md"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Message!"
          />
          <button
            className="ml-2 text-gray-400 p-2 rounded-md"
            onClick={sendMessage}
          >
            <i className="fa-solid fa-paperclip"></i>
          </button>
          <button className="ml-2 text-gray-400 p-2 rounded-md">
            <i className="fa-solid fa-face-smile"></i>
          </button>
          <button
            className="ml-2 text-blue-500 p-2 rounded-md"
            onClick={sendMessage}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default LiveChat;
