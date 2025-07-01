import { useEffect, useState } from "react";
import Card from "../Card/Card";
import { useRoom } from "../context/RoomContext/RoomContext";
import { useWebSocket } from "../context/WebSocketContext/WebSocketContext";
import { ParticipantCard } from "../ParticipantCard/ParticipantCard";

interface Participant {
  id: string;
  name: string;
  voted: boolean;
  value: any;
}

type VoteValue = number | '?' | null;

interface Vote {
  userId: string;
  value: VoteValue;
}

interface Ticket {
  id: string;
  title: string;
  isActive: boolean;
  votes: Vote[];
  revealed: boolean;
}

const values = [1, 2, 3, 5, 8, 13, "?", "coffee"];

const RoomView = () => {
  const { roomState } = useRoom();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const { lastMessage, send } = useWebSocket();

  const currentUserId = roomState?.userId;

  const allVoted = participants.every(participant => participant.voted);
  const canReset = activeTicket?.revealed && allVoted;

  const handleReset = () => {
    send({ type: 'reset' });
  };

  const currentUserVote = activeTicket?.votes?.find(vote => vote.userId === currentUserId)?.value;
  const revealed = activeTicket?.revealed ?? false;

  const handleVote = (val: number | string) => {
    send({ type: 'vote', value: val });
  };

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'update') {
      setParticipants(lastMessage.participants);
      setActiveTicket(lastMessage.ticket);
    }
  }, [lastMessage]);

  if (!roomState) {
    return <div>Please join a room first.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-200 via-amber-100 to-rose-100 p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">
        {revealed ? 'Votes revealed' : 'Choose your estimate'}
      </h2>
      {activeTicket && (
        <div className="mb-6 text-blue-900 text-lg font-medium">
          Estimating ticket: <span className="font-semibold">{activeTicket.title}</span>
        </div>
      )}
      {!revealed && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {values.map((val, i) => (
            <Card
              key={i}
              value={val}
              selected={val === currentUserVote}
              onVote={() => handleVote(val)}
              disabled={revealed}
            />
          ))}
        </div>
      )}

      {revealed && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              name={participant.name}
              vote={participant.value}
              revealed={revealed}
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2 w-full text-right">Participants:</h2>
      <ul className="list-none pl-5 space-y-1 w-full text-right">
        {participants.map((participant) => (
          <li key={participant.id} className="text-lg">
            {participant.name} {participant.voted ? '✅' : '⏳'}
            {activeTicket?.revealed && participant.value !== null && (
              <span> — Vote: {participant.value}</span>
            )}
            {participant.id === currentUserId && <span> (Current user)</span>}
          </li>
        ))}
      </ul>

      {canReset && (
        <button
          onClick={handleReset}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
        >
          Reset Round
        </button>
      )}
    </div>
  );
};

export default RoomView
