import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Participant {
  id: string;
  name: string;
}

type VoteValue = number | '?' | null;

interface Vote {
  userId: string;
  value: VoteValue;
}

interface Ticket {
  id: string;
  title: string;
  votes: Vote[];
  isActive: boolean;
  revealed: boolean;
}

interface Room {
  id: string;
  participants: Participant[];
  tickets: Ticket[];
}

const predefinedTickets: Omit<Ticket, 'votes'>[] = [
  { id: uuidv4(), title: 'Login page bug', isActive: true, revealed: false },
  { id: uuidv4(), title: 'Implement signup API', isActive: false, revealed: false },
  { id: uuidv4(), title: 'Refactor user service', isActive: false, revealed: false },
];

const rooms: Record<string, Room> = {};
const clients: Map<any, { roomId: string; userId: string }> = new Map();

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', ((ws: any) => {
  ws.on('message', ((data: any) => {
    const msg = JSON.parse(data.toString());

    switch (msg.type) {
      case 'join': {
        const { name, roomId } = msg;
        const userId = uuidv4();
        let room = rooms[roomId];
        if (!room) {
          room = {
            id: roomId,
            participants: [],
            tickets: predefinedTickets.map((t) => ({ ...t, votes: [] })),
          };
          rooms[roomId] = room;
        }

        room.participants.push({ id: userId, name });

        clients.set(ws, { roomId, userId });

        // Send initial participant ID to the client
        console.log('👤 New user joined:', { name, roomId, userId });
        ws.send(JSON.stringify({ type: 'joined', userId }));

        broadcast(roomId);
        break;
      }

      case 'vote': {
        const { value } = msg;
        const client = clients.get(ws);
        if (!client) return;

        const room = rooms[client.roomId];
        const ticket = room.tickets.find((t) => t.isActive);
        if (!ticket) return;

        const existingVote = ticket.votes.find((v) => v.userId === client.userId);
        if (existingVote) {
          existingVote.value = value;
        } else {
          ticket.votes.push({ userId: client.userId, value });
        }

        broadcast(client.roomId);
        break;
      }

      case 'reset': {
        const client = clients.get(ws);
        if (!client) return;

        const room = rooms[client.roomId];
        const ticket = room.tickets.find((t) => t.isActive);
        if (!ticket) return;

        ticket.votes = [];
        ticket.revealed = false;

        broadcast(client.roomId);
        break;
      }

      case 'reveal': {
        const client = clients.get(ws);
        if (!client) return;

        const room = rooms[client.roomId];
        const ticket = room.tickets.find((t) => t.isActive);
        if (!ticket) return;

        ticket.revealed = true;
        broadcast(client.roomId);
        break;
      }

      case 'new_ticket': {
        const { title } = msg;
        const client = clients.get(ws);
        if (!client) return;

        const room = rooms[client.roomId];
        room.tickets.forEach((t) => (t.isActive = false));

        const newTicket: Ticket = {
          id: uuidv4(),
          title,
          votes: [],
          isActive: true,
          revealed: false,
        };

        room.tickets.push(newTicket);
        broadcast(client.roomId);
        break;
      }
    }
  }));

  ws.on('close', () => {
    const client = clients.get(ws);
    if (!client) return;

    const room = rooms[client.roomId];
    room.participants = room.participants.filter((p) => p.id !== client.userId);

    room.tickets.forEach((ticket) => {
      ticket.votes = ticket.votes.filter((v) => v.userId !== client.userId);
    });

    if (room.participants.length === 0) {
      delete rooms[client.roomId];
    } else {
      broadcast(client.roomId);
    }

    clients.delete(ws);
  });
}));

function broadcast(roomId: string) {
  const room = rooms[roomId];
  const ticket = room.tickets.find((t) => t.isActive);
  if (!ticket) return;

  const participants = room.participants.map((p) => {
    const userVote = ticket.votes.find((v) => v.userId === p.id);
    return {
      id: p.id,
      name: p.name,
      voted: !!userVote,
      value: ticket.revealed ? userVote?.value ?? null : null,
    };
  });

  const payload = JSON.stringify({
    type: 'update',
    participants,
    ticket: {
      id: ticket.id,
      title: ticket.title,
      isActive: ticket.isActive,
      revealed: ticket.revealed,
    },
  });

  clients.forEach((info, client) => {
    if (info.roomId === roomId) {
      client.send(payload);
    }
  });
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
