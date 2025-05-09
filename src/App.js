// import React from 'react';
// import './style.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { WebSocketProvider } from './WebSocketContext';
// import NikeList from './Components/NikeList';
// import NikeCreate from './Components/NikeCreate';
// import NikeUpdate from './Components/NikeUpdate';
// import NikeDelete from './Components/NikeDelete';
// import LoginForm from './Components/LoginForm';
// import RegisterForm from './Components/RegisterForm';
// import LogoutForm from './Components/LogoutForm';


// function App() {
//   return (
//     <WebSocketProvider> 
//       <BrowserRouter>
//         <Routes>
//           <Route exact path="/" element={<NikeList />} />
//           <Route path="/create" element={<NikeCreate />} />
//           <Route path="/update" element={<NikeUpdate />} />
//           <Route path="/delete" element={<NikeDelete />} />
//           <Route path="/register" element={<RegisterForm />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/logout" element={<LogoutForm />} />
//         </Routes>
//       </BrowserRouter>
//     </WebSocketProvider>
//   );
// }
  
//   export default App;

import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext';
import AdminDashboard from './Pages/AdminDashboard';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import UserDashboard from './Pages/UserDashboard';
import Cart from './Pages/Cart';
import OrdersPage from './Pages/Orders';
// import NikeList from './Components/NikeList';
// import NikeCreate from './Components/NikeCreate';
// import NikeUpdate from './Components/NikeUpdate';
// import NikeDelete from './Components/NikeDelete';
// import LoginForm from './Components/LoginForm';
// import RegisterForm from './Components/RegisterForm';
// import LogoutForm from './Components/LogoutForm';


function App() {
  return (
    <WebSocketProvider> 
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/buy-it" element={<UserDashboard />} />
        <Route path="/cart-items" element={<Cart />} />
        <Route path="/orders" element={<OrdersPage />} />
          {/* <Route path="/create" element={<NikeCreate />} />
          <Route path="/update" element={<NikeUpdate />} />
          <Route path="/delete" element={<NikeDelete />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LogoutForm />} /> */}
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}
  
  export default App;

