import { useEffect, useRef } from "react";

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onopen = () => console.log("Connected");
    ws.current.onclose = () => console.log("Disconnected");
    ws.current.onerror = (e) => console.error("WebSocket error", e);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    return () => {
      ws.current?.close();
    };
  }, [url]);



  const send = (data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open");
    }
  };

  return { send };
}