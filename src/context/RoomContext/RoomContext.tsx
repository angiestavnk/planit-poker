import { createContext, useContext, useState, type ReactNode } from 'react';

interface RoomState {
  roomId: string;
  userId: string;
  name: string;
}

type RoomContextType = {
  roomState: RoomState | null;
  setRoomState: (s: RoomState) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, setRoomState] = useState<RoomState | null>(() => {
    const raw = localStorage.getItem('roomState');
    return raw ? JSON.parse(raw) : null;
  });

  const safeSetState = (s: RoomState) => {
    localStorage.setItem('roomState', JSON.stringify(s));
    setRoomState(s);
  };

  return (
    <RoomContext.Provider value={{ roomState, setRoomState: safeSetState }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const roomContext = useContext(RoomContext);
  if (!roomContext) {
    throw new Error('useRoom hook must be used inside <RoomProvider>')
  }
  return roomContext;
};
