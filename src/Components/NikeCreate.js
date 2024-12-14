import React, { useState } from 'react';
import axios from 'axios';
import { useWebSocket } from '../WebSocketContext';



const NikeCreate = () => {
  const [formData, setFormData] = useState({
    ShoeName: '',
    ShoeNumber: 0,
    ShoeType: '',
    Gender: '',
    Price: 0,
    images: null
  });

  const webSocket = useWebSocket();
  
  const handleChange = event => {
    const { name, value, files } = event.target;

    if (name === "images" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prevState => ({
          ...prevState,
          images: reader.result, 
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('ShoeName', formData.ShoeName);
    formDataToSend.append('ShoeNumber', formData.ShoeNumber);
    formDataToSend.append('ShoeType', formData.ShoeType);
    formDataToSend.append('Gender', formData.Gender);
    formDataToSend.append('Price', formData.Price);
    formDataToSend.append('images', formData.images);

    axios.post('http://127.0.0.1:8000/api/nike/', formDataToSend)
    .then(response => {
      console.log('Nike shoe created successfully:', response.data);

      const newShoeData = {
        ShoeName: formData.ShoeName,
        ShoeNumber: formData.ShoeNumber,
        ShoeType: formData.ShoeType,
        Gender: formData.Gender,
        Price: formData.Price,
        images: response.data.images 
      };

      webSocket.current.send(JSON.stringify({
        type: 'nike.update',
        new_shoe: JSON.stringify(newShoeData)
      }));
    })
    .catch(error => {
      console.error('Error creating Nike shoe:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
      }
    });
};

 
  return (
    <div className='Create-Nike'>
      <h2>Create Nike Shoe</h2>
      <form onSubmit={handleSubmit}>
        <label>Shoe Name:</label>
        <input type="text" name="ShoeName" value={formData.ShoeName} onChange={handleChange} required />

        <label>Shoe Number:</label>
        <input type="number" name="ShoeNumber" value={formData.ShoeNumber} onChange={handleChange} required />

        <label>Shoe Type:</label>
        <input type="text" name="ShoeType" value={formData.ShoeType} onChange={handleChange} required />

        <label>Gender:</label>
        <input type="text" name="Gender" value={formData.Gender} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="Price" value={formData.Price} onChange={handleChange} required />

        <label>images:</label>
        <input type="file" name="images" accept="image/png, image/jpeg" onChange={handleChange} required />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default NikeCreate;