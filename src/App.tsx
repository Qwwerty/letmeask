import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminRoom } from './pages/AdminRoom';

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"
import { Room } from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthContextProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/rooms/new' element={<NewRoom />} />
            <Route path='/rooms/:id' element={<Room />} />

            <Route path='admin/rooms/:id' element={<AdminRoom />} />
            <Route path='*' element={<Home />} />
          </Routes>
        </AuthContextProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
