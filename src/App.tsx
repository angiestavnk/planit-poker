import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LobbyView from './LobbyView/LobbyView'
import RoomView from './RoomView/RoomView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby" element={<LobbyView />} />
        <Route path="/room/:roomId" element={<RoomView />} />
        <Route path="*" element={<Navigate to="/lobby" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
