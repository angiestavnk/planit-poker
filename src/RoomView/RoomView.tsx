import { useEffect, useState } from "react";
import Card from "../Card/Card";
import { useRoom } from "../context/RoomContext/RoomContext";
import { useWebSocket } from "../context/WebSocketContext/WebSocketContext";

interface Participant {
  id: string;
  name: string;
  voted: boolean;
  value: any;
}

interface Ticket {
  id: string;
  title: string;
  isActive: boolean;
  revealed: boolean;
}

const RoomView = () => {
  const values = [1, 2, 3, 5, 8, 13, "?", "teacup"];

  const { roomState } = useRoom();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const { lastMessage, send } = useWebSocket();

  const currentUserId = roomState?.userId;

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'update') {
      console.log('✅ JOINED', lastMessage);
      setParticipants(lastMessage.participants);
      setActiveTicket(lastMessage.ticket);
    }
  }, [lastMessage]);

  if (!roomState) {
    return <div>Please join a room first.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-200 via-amber-100 to-rose-100 p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Choose your estimate</h2>
      <div className="grid grid-cols-4 gap-4">
        {values.map((val, index) => (
          <Card key={index} value={val} />
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2">Participants:</h2>
      <ul className="list-disc pl-5 space-y-1">
        {participants.map((p) => (
          <li key={p.id} className="text-lg">
            {p.name} {p.voted ? '✅' : '❌'}
            {activeTicket?.revealed && p.value !== null && <span> — Vote: {p.value}</span>}
            {p.id === currentUserId && <span> (You)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomView
