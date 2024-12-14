import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData);
      console.log('Login successful:', response.data);
      // Handle successful login, e.g., store the access token in local storage and redirect to dashboard
    } catch (error) {
      console.error('Login error:', error.response.data);
      // Handle error, e.g., display an error message
    }
  };

  const navigate = useNavigate();
  return (
    <div className='login-form'>
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <button2 onClick={() => navigate('/register')}>RegisterForm</button2>
    </div>
  );
};

export default LoginForm;