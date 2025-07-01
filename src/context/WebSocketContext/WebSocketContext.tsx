import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface WSContextType {
  send: (data: any) => void;
  lastMessage: any | null;
  connected: boolean;
}

const WebSocketContext = createContext<WSContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const ws = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const send = (data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, message dropped", data);
    }
  };

  return (
    <WebSocketContext.Provider value={{ send, lastMessage, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
