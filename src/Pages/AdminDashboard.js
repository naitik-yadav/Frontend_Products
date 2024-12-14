import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';


function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newProductData, setNewProductData] = useState({
    product_name: '',
    product_number: '',
    product_type: '',
    description: '',
    category: '',
    Price: '',
  });


  useEffect(() => {
    axiosInstance.get('/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axiosInstance.get('/user')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleViewProductsClick = () => {
    setShowProductPopup(true);
  };

  const handleProductPopupClose = () => {
    setShowProductPopup(false);
    setSelectedProduct(null); // Reset selected product
  };

  const handleViewUsersClick = () => {
    setShowUserPopup(true);
  };

  const handleUserPopupClose = () => {
    setShowUserPopup(false);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product); // Set the selected product
  };

  const handleEditButtonClick = (product) => {
    setEditProductData(product);
    setShowEditPopup(true);
};

const handleEditPopupClose = () => {
    setShowEditPopup(false);
    setEditProductData(null);
    setSelectedFile(null);
};

const handleEditProduct = async (product) => {
  const formData = new FormData();
  formData.append('product_name', product.product_name);
  formData.append('Price', product.Price);
  // Append other fields as necessary
  if (selectedFile) {
    formData.append('images', selectedFile); // Append the selected file
  }

  try {
    const response = await axiosInstance.patch(`/products/${product.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type for file upload
      },
    });
    console.log('Product updated successfully:', response.data);
    // Update the products state with the updated product
    setProducts(products.map(p => (p.id === product.id ? response.data : p)));
  } catch (error) {
    console.error('Error updating product:', error.response.data);
  }
};

const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    await handleEditProduct(editProductData);
    handleEditPopupClose();
};

const handleDeleteProduct = async (productId) => {
  try {
    await axiosInstance.delete(`/products/${productId}/`);
    console.log('Product deleted successfully');
    setProducts(products.filter(product => product.id !== productId)); // Remove the deleted product from state
  } catch (error) {
    console.error('Error deleting product:', error.response.data);
  }
};

const handleDeleteButtonClick = (productId) => {
  setProductToDelete(productId); // Set the product ID to delete
  setShowDeletePopup(true); // Show the delete confirmation popup
};

const handleDeletePopupClose = () => {
  setShowDeletePopup(false);
  setProductToDelete(null); // Reset the product ID
};

const confirmDelete = () => {
  handleDeleteProduct(productToDelete); // Call the delete function
  handleDeletePopupClose(); // Close the popup
};

const handleCreateButtonClick = () => {
  setShowCreatePopup(true); // Show the create product form
};

const handleCreatePopupClose = () => {
  setShowCreatePopup(false);
  setNewProductData({
    product_name: '',
    product_number: '',
    product_type: '',
    description: '',
    category: '',
    Price: '',
  }); // Reset new product data
  setSelectedFile(null); // Reset selected file
};

const handleCreateProduct = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('product_name', newProductData.product_name);
  formData.append('product_number', newProductData.product_number);
  formData.append('product_type', newProductData.product_type);
  formData.append('description', newProductData.description);
  formData.append('category', newProductData.category);
  formData.append('Price', newProductData.Price);
  if (selectedFile) {
    formData.append('images', selectedFile);
}

const token = localStorage.getItem('access_token');

  try {
    const response = await axiosInstance.post('/create-product/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,  
      },
    });
    console.log('Product created successfully:', response.data);
    setProducts([...products, response.data]); // Add the new product to the state
    handleCreatePopupClose(); // Close the create product form
  } catch (error) {
    console.error('Error creating product:', error.response.data);
  }
};

const handleCreateProductSubmit = (e) => {
  handleCreateProduct(e);
};

const handleUsersClick = () => {
  setShowUserPopup(true); 
};

const handleProductsClick = () => {
  setShowProductPopup(true);
};

const handleLogout = async () => {
  const refreshToken = localStorage.getItem('refresh_token'); // Assuming you store the refresh token in local storage

  try {
    await axiosInstance.post('/logout/', { refresh: refreshToken });
    // Remove tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Optionally, redirect to login page or show a success message
    window.location.href = '/login'; // Redirect to login page
  } catch (error) {
    console.error('Error logging out:', error.response.data);
  }
};


  return (
    <div className="admin-dashboard">
      <Header />
      <div className="main-content">
      <Sidebar 
          onProductsClick={handleProductsClick} 
          onUsersClick={handleUsersClick} 
          onLogout={handleLogout}
        />
        <div className="content">
          <Card
            title="Products"
            buttonLabel="View Products"
            onClick={handleViewProductsClick}
          />
                  <button onClick={handleCreateButtonClick}>Add Product</button> {/* Add this line */}

          <Card
            title="Users"
            buttonLabel="View Users"
            onClick={handleViewUsersClick}
          />
          {showProductPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>Product Details</h2>
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Product Number</th>
                      <th>Product Type</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.product_name}</td>
                        <td>{product.product_number}</td>
                        <td>{product.product_type}</td>
                        <td>{product.description}</td>
                        <td>{product.category}</td>
                        <td>{product.Price}</td>
                        <td>
                          <button onClick={() => handleViewDetails(product)}>View Details</button>
                          <button onClick={() => handleEditButtonClick(product)}>Edit</button>
                          <button onClick={() => handleDeleteButtonClick(product.id)}>Delete</button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleProductPopupClose}>Close</button>
              </div>
            </div>
          )}
          {selectedProduct && (
            <div className="modal">
              <div className="modal-content">
                <h2>{selectedProduct.product_name}</h2>
                {/* <img src={selectedProduct.image_url} alt={selectedProduct.product_name} /> */}
                <p><strong>Product Number:</strong> {selectedProduct.product_number}</p>
                <p><strong>Product Type:</strong> {selectedProduct.product_type}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Price:</strong> ${selectedProduct.Price}</p>
                <button onClick={handleProductPopupClose}>Close</button>
              </div>
            </div>
          )}
          {showEditPopup && editProductData && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditProductSubmit}>
              <label>
                Product Name:
                <input
                  type="text"
                  value={editProductData.product_name}
                  onChange={(e) => setEditProductData({ ...editProductData, product_name: e.target.value })}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={editProductData.Price}
                  onChange={(e) => setEditProductData({ ...editProductData, Price: e.target.value })}
                />
              </label>
              <label>
                Select Image:
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])} // Set the selected file
                />
              </label>
              {/* Add other fields as necessary */}
              <button type="submit">Update</button>
              <button type="button" onClick={handleEditPopupClose}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={handleDeletePopupClose}>Cancel</button>
          </div>
        </div>
      )}
          {showUserPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>User Details</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleUserPopupClose}>Close</button>
              </div>
            </div>
          )}
          {showCreatePopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>Create Product</h2>
                <form onSubmit={handleCreateProductSubmit}>
                  <label>
                    Product Name:
                    <input
                      type="text"
                      value={newProductData.product_name}
                      onChange={(e) => setNewProductData({ ...newProductData, product_name: e.target.value })}
                    />
                  </label>
                  <label>
                    Product Number:
                    <input
                      type="number"
                      value={newProductData.product_number}
                      onChange={(e) => setNewProductData({ ...newProductData, product_number: e.target.value })}
                    />
                  </label>
                  <label>
                    Product Type:
                    <input
                      type="text"
                      value={newProductData.product_type}
                      onChange={(e) => setNewProductData({ ...newProductData, product_type: e.target.value })}
                    />
                  </label>
                  <label>
                    Description:
                    <input
                      type="text"
                      value={newProductData.description}
                      onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                    />
                  </label>
                  <label>
                    Category:
                    <input
                      type="text"
                      value={newProductData.category}
                      onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      value={newProductData.Price}
                      onChange={(e) => setNewProductData({ ...newProductData, Price: e.target.value })}
                    />
                  </label>
                  <label>
                    Select Image:
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])} // Set the selected file
                    />
                  </label>
                  <button type="submit">Create</button>
                  <button type="button" onClick={handleCreatePopupClose}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1>Admin Dashboard</h1>
    </div>
  );
}

function Sidebar({ onProductsClick, onUsersClick, onLogout }) {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <i className="fas fa-dashboard"></i>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <i className="fas fa-product-hunt"></i>
          <a href="#" onClick={onProductsClick}>Products</a> {/* Products click handler */}
        </li>
        <li>
          <i className="fas fa-user"></i>
          <a href="#" onClick={onUsersClick}>Users</a> {/* Users click handler */}
        </li>
        <li>
          <i className="fas fa-sign-out-alt"></i>
          <a href="/" onClick={onLogout}>Logout</a> {/* Logout button */}
        </li>
      </ul>
    </div>
  );
}
  
  function Card({ title, buttonLabel, icon, onClick }) {
    return (
      <div className="card">
        <h2>{title}</h2>
        {icon}
        <button onClick={onClick}>{buttonLabel}</button>
      </div>
    );
  }
  
  export default AdminDashboard;