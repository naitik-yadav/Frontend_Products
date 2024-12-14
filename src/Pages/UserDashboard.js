import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, 
    };

    const [products, setProducts] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigate = useNavigate();

    
    useEffect(() => {
        axiosInstance.get('/products/')
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    }, []); 

    const addToCart = (productId) => {
        axiosInstance.post('/cart/', { product_id: productId })
            .then(response => {
                console.log('Item added to cart:', response.data);
                setCartItemCount(prevCount => prevCount + 1);
            })
            .catch(error => {
                console.error('Error adding item to cart:', error);
            });
    };

    const handleCartClick = () => {
        navigate('/cart-items'); 
    };

    return (
        <div className="dashboard-container">
            <div className="cart-icon" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faShoppingCart} size="2x" />
            {cartItemCount > 0 && (
                <span className="cart-item-count">{cartItemCount}</span>
            )}
        </div>
            {/* Slider Section */}
            <div className="user-slider">
                <Slider {...settings}>
                    <div className="slides slide1">
                        <h2 className="text-background">Get Fit, Stay Healthy!</h2>
                    </div>
                    <div className="slides slide2">
                        <h2 className="text-background">Join Our Community</h2>
                   </div>
                    <div className="slides slide3">
                        <h2 className="text-background">Explore Our Programs</h2>
                    </div>
                </Slider>
            </div>

            {/* Products Section */}
            <div className="product-container">
                {products.map(product => (
                    <div className="product-card" key={product.id}>
                        <img src={product.images} alt={product.product_name} className="product-image" />
                        <h2>{product.product_name}</h2>
                        <p>Price: ${product.Price}</p>
                        <button onClick={() => addToCart(product.id)}>Add Item</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserDashboard;