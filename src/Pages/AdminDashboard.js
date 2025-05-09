import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


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
  const [graphData, setGraphData] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Modify the functions
  const handleViewDetails = (product) => {
    setSelectedProduct(product); // Set the selected product
    setShowDetailsModal(true); // Open the details modal
  };
  
  const handleEditButtonClick = (product) => {
    setEditProductData(product);
    setShowEditModal(true); // Open the edit modal
  };
  
  const handleDeleteButtonClick = (productId) => {
    setProductToDelete(productId); // Set the product ID to delete
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

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

//   const handleViewDetails = (product) => {
//     setSelectedProduct(product); // Set the selected product
//   };

//   const handleEditButtonClick = (product) => {
//     setEditProductData(product);
//     setShowEditPopup(true);
// };

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

// const handleDeleteButtonClick = (productId) => {
//   setProductToDelete(productId); // Set the product ID to delete
//   setShowDeletePopup(true); // Show the delete confirmation popup
// };

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

useEffect(() => {
  const graphData = [
    { name: 'Users', value: users.length },
    { name: 'Products', value: products.length },
  ];
  setGraphData(graphData);
}, [users, products]);

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
        <div className="card mb-4">
          <div className="card-header">
          <h5 className="dashboard-title"><i className="fas fa-chart-line"></i> Dashboard Overview</h5>
          </div>
          <div className="card-body">
            <div className="graph-container" style={{ padding: '20px', borderRadius: '10px' }}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#000" fillOpacity={0.7} fill="#000" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  <div className="card-container"> 
    <Card
      title="Products"
      buttonLabel="View Products"
      onClick={handleViewProductsClick}
    />
    <Card
      title="Users"
      buttonLabel="View Users"
      onClick={handleViewUsersClick}
    />
  </div>
  <button onClick={handleCreateButtonClick}>Add Product</button>
  {showProductPopup && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2><i className="fa fa-shopping-cart"></i> Product Details</h2>
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
  <i 
    className="fas fa-eye" 
    onClick={() => handleViewDetails(product)} 
    style={{ cursor: 'pointer', marginRight: '10px' }} 
    title="View Details"
  ></i>
  <i 
    className="fas fa-edit" 
    onClick={() => handleEditButtonClick(product)} 
    style={{ cursor: 'pointer', marginRight: '10px' }} 
    title="Edit"
  ></i>
  <i 
    className="fas fa-trash" 
    onClick={() => handleDeleteButtonClick(product.id)} 
    style={{ cursor: 'pointer' }} 
    title="Delete"
  ></i>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleProductPopupClose}>Close</button>
    </div>
  </div>
)}
          {showDetailsModal && selectedProduct && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{selectedProduct.product_name}</h2>
          <p><strong>Product Number:</strong> {selectedProduct.product_number}</p>
          <p><strong>Product Type:</strong> {selectedProduct.product_type}</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <p><strong>Category:</strong> {selectedProduct.category}</p>
          <p><strong>Price:</strong> ${selectedProduct.Price}</p>
          <button onClick={() => setShowDetailsModal(false)}>Close</button>
        </div>
      </div>
    )}

{showEditModal && editProductData && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2><i className="fas fa-luggage-cart"></i> Edit Product</h2>
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
            <button type="submit">Update</button>
            <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
          </form>
        </div>
      </div>
    )}
       {showDeleteModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this product?</p>
          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      </div>
    )}
         {showUserPopup && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2><i className="fa fa-users" aria-hidden="true"></i> User Details</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
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
      <div className="modal-overlay">
        <div className="modal-content">
          <h2><i className="fa fa-cart-plus"></i> Create Product</h2>
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
                onChange={(e) => setSelectedFile(e.target.files[0])}
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
      <h1><i className="fas fa-user-secret"></i> Admin Dashboard</h1>
    </div>
  );
}

function Sidebar({ onProductsClick, onUsersClick, onLogout }) {
  return (
    <div className="sidebar">
    <ul>
      <li><a href="/"><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
      <li><a href="#" onClick={onProductsClick}><i className="fas fa-box"></i> Products</a></li>
      <li><a href="#" onClick={onUsersClick}><i className="fas fa-users"></i> Users</a></li>
      <li><a href="/" onClick={onLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
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