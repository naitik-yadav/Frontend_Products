import React from 'react';
import axios from 'axios';

const LogoutForm = () => {
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/logout/', {
        refresh: 'refresh_token_here', // Replace 'refresh_token_here' with the actual user's refresh token
      });
      console.log('Logout successful:', response.data);
      // Handle successful logout, e.g., clear the user's authentication tokens or session information
    } catch (error) {
      console.error('Logout error:', error.response.data);
      // Handle error, e.g., display an error message
    }
  };

  return (
    <div className='logout-form'>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutForm;


