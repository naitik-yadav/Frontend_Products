import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';


const NikeList = () => {
  const [nikeShoes, setNikeShoes] = useState([]);
  const webSocket = useWebSocket(); // Use the WebSocket context

  useEffect(() => {
    // Fetch initial data
    axios.get('http://localhost:8000/api/nike/')
      .then(response => {
        setNikeShoes(response.data);
      })
      .catch(error => {
        console.error('Error fetching Nike shoes:', error);
      });
  
    // Handle updates received from WebSocket if webSocket is available
    if (webSocket && webSocket.current) {
      webSocket.current.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data.type === 'nike.update') {
          // Assuming newShoeData is the updated shoe data
          const newShoeData = JSON.parse(data.new_shoe);
          setNikeShoes(newShoeData);
        }
      };
    }
  
    return () => {
      if (webSocket && webSocket.current) {
        webSocket.current.onmessage = null;
      }
    };
  }, [webSocket]);


  const navigate = useNavigate();
  return (
    <div className="Nike">
    <nav className="navbar">
        <div className="navbar-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>
      <h1>NIKE</h1>
    <div className="card-container">
       {nikeShoes.map(shoe => (
        <div key={shoe.id} className="card">
          <img
            src={`http://localhost:8000${shoe.images}?timestamp=${Date.now()}`} 
            alt="Nikeshoe"
            className="card-image"
          />
          <div className="card-details">
            <p>{shoe.ShoeName}</p>
            <p>Shoe Number: {shoe.ShoeNumber}</p>
            <p>Shoe Type: {shoe.ShoeType}</p>
            <p>Gender: {shoe.Gender}</p>
            <p>Price: ₹{shoe.Price}</p>
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => navigate('/create')}>Create</button>
  </div>
);
};

export default NikeList;