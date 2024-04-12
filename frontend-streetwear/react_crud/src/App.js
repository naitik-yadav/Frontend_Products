import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext';
import NikeList from './Components/NikeList';
import NikeCreate from './Components/NikeCreate';
import NikeUpdate from './Components/NikeUpdate';
import NikeDelete from './Components/NikeDelete';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import LogoutForm from './Components/LogoutForm';


function App() {
  return (
    <WebSocketProvider> 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<NikeList />} />
          <Route path="/create" element={<NikeCreate />} />
          <Route path="/update" element={<NikeUpdate />} />
          <Route path="/delete" element={<NikeDelete />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LogoutForm />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}
  
  export default App;

