import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NikeDelete = () => {
  const [nikeList, setNikeList] = useState([]);
  const [selectedShoeId, setSelectedShoeId] = useState('');

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

  const handleDelete = () => {
    if (!selectedShoeId) return;
    axios.delete(`http://localhost:8000/api/nike/${selectedShoeId}/`)
      .then(response => {
        console.log('Nike shoe deleted successfully:', response.data);
        setSelectedShoeId('');
      })
      .catch(error => {
        console.error('Error deleting Nike shoe:', error);
      });
  };

  return (
    <div className='Nike_Del'>
      <h2>Delete Nike Shoe</h2>
      <div>
        <label>Select Nike Shoe:</label>
        <select value={selectedShoeId} onChange={e => setSelectedShoeId(e.target.value)}>
          <option value="">Select a Nike Shoe</option>
          {nikeList.map(nike => (
            <option key={nike.id} value={nike.id}>{nike.ShoeName}</option>
          ))}
        </select>
        <button onClick={handleDelete} disabled={!selectedShoeId}>Delete</button>
      </div>
    </div>
  );
};

export default NikeDelete;