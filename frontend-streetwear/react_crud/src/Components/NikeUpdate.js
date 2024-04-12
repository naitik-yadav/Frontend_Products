import React, { useState, useEffect } from 'react';
import axios from 'axios';


const NikeUpdate = () => {
  const [nikeList, setNikeList] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    ShoeName: '',
    ShoeNumber: 0,
    ShoeType: '',
    Gender: '',
    Price: 0,
    images: null
  });

  useEffect(() => {
    fetchNikeList();
  }, []);

  const fetchNikeList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/nike/');
      setNikeList(response.data);
    } catch (error) {
      console.error('Error fetching Nike list:', error);
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = event => {
    const imageFile = event.target.files[0];
    setFormData(prevState => ({ ...prevState, images: imageFile }));
  };

  const handleUpdate = async event => {
    event.preventDefault();
    const { id, ...dataToUpdate } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('ShoeName', dataToUpdate.ShoeName);
    formDataToSend.append('ShoeNumber', dataToUpdate.ShoeNumber);
    formDataToSend.append('ShoeType', dataToUpdate.ShoeType);
    formDataToSend.append('Gender', dataToUpdate.Gender);
    formDataToSend.append('Price', dataToUpdate.Price);

    if (dataToUpdate.images) {
      const reader = new FileReader();
      reader.onload = function (e) {
        formDataToSend.append('images', e.target.result);
        sendUpdateRequest(id, formDataToSend);
      };
      reader.readAsDataURL(dataToUpdate.images);
    } else {
      sendUpdateRequest(id, formDataToSend);
    }
  };

  const sendUpdateRequest = async (id, formDataToSend) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/nike/${id}/`, formDataToSend);
      console.log('Nike shoe updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating Nike shoe:', error);
    }
  };

  

  return (
    <div>
      <h2>Update Nike Shoe</h2>
      <form onSubmit={handleUpdate}>
        <label>Select Nike Shoe:</label>
        <select name="id" onChange={handleChange}>
          <option value="">Select a Nike Shoe</option>
          {nikeList.map(nike => (
            <option key={nike.id} value={nike.id}>{nike.ShoeName}</option>
          ))}
        </select>

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

        <label>Image:</label>
        <input type="file" name="images" accept="image/png, image/jpeg" onChange={handleImageChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default NikeUpdate;