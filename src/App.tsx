import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LobbyView from './LobbyView/LobbyView'
import RoomView from './RoomView/RoomView'
import { useWebSocket } from './context/WebSocketContext/WebSocketContext';

function App() {
  const { connected } = useWebSocket();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby" element={<LobbyView />} />
        {
          connected ? <Route path="/room/:roomId" element={<RoomView />} /> : (
            <Route path="/room/:roomId" element={<Navigate to='/lobby' replace />} />
          )
        }
        <Route path="*" element={<Navigate to="/lobby" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
