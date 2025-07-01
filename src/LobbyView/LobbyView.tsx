import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../components/Animation/Animation";
import { useRoom } from "../context/RoomContext/RoomContext";
import { useWebSocket } from "../context/WebSocketContext/WebSocketContext";

const latinRegex = /^[A-Za-z]+$/;
const roomId = '1'

const LobbyView = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { send, lastMessage } = useWebSocket();
  const { setRoomState } = useRoom();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError("");
  };

  const validate = (): boolean => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Name is required");
      return false;
    }

    if (trimmedName.length < 3) {
      setError("Name must be at least 3 characters")
      return false
    }

    if (!latinRegex.test(trimmedName)) {
      setError("Please use latin letters");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      send({ type: 'join', name: name.trim(), roomId });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!lastMessage) return;

    const msg = lastMessage;

    if (msg.type === 'joined') {
      setRoomState({ roomId, userId: msg.userId, name });
      navigate(`/room/${roomId}`);
    }
  }, [lastMessage, roomId, name, setRoomState, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center overflow-hidden justify-center bg-gradient-to-b from-orange-200 via-amber-100 to-rose-100 p-6 relative">
      <div className="mb-8 max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          Welcome to Planit Poker
        </h1>
        <p className="text-gray-700 text-lg">
          Please enter your name and enter the room to participate in voting.
        </p>
      </div>

      <input
        type="text"
        value={name}
        id="name"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your name"
        className={`border rounded-md p-3 text-lg w-72 focus:outline-none focus:ring-2 ${error
          ? "border-red-500 focus:ring-red-500"
          : "border-blue-400 focus:ring-blue-500"
          }`}
      />
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-6 px-8 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
      >
        Enter the room
      </button>

      <div className="absolute bottom-4 right-4">
        <Cat />
      </div>
    </div>
  );
}

export default LobbyView
