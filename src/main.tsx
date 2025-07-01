import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoomProvider } from './context/RoomContext/RoomContext.tsx'
import { WebSocketProvider } from './context/WebSocketContext/WebSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <RoomProvider>
    <WebSocketProvider url="ws://localhost:3000">
      <App />
    </WebSocketProvider >
  </RoomProvider>
)
