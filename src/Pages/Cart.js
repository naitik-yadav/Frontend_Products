import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Cart = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // Set the duration for each slide (in milliseconds)
    };


    const [cart, setCart] = useState(null); // State to hold the cart object
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart/'); // Adjust the URL based on your API endpoint
                console.log(response.data); // Log the response data
                setCart(response.data); // Set the entire cart object
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (itemId) => {
        try {
            await axiosInstance.delete(`/cart/${itemId}/`); // Adjust the URL based on your API endpoint
            // After successful deletion, fetch the cart items again to update the state
            const response = await axiosInstance.get('/cart/');
            setCart(response.data);
        } catch (err) {
            setError(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching cart items: {error.message}</div>;
    }
    

    const cartItems = cart?.items || []; 
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.product.Price) * item.quantity);
    }, 0).toFixed(2);

    return (
        <div className="cart-container">
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
            <h1>Your Cart</h1>
            <div className="cart-content">
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div className="cart-item-card" key={item.id}>
                            <img 
                                src={`http://127.0.0.1:8000${item.product.images}`} // Construct the full image URL
                                alt={item.product.product_name} 
                                className="product-image" 
                            />
                            <h2 className="product-name">{item.product.product_name}</h2>
                            <p className="product-quantity">Quantity: {item.quantity}</p>
                            <p className="product-price">Price: ${parseFloat(item.product.Price).toFixed(2)}</p>
                            <button 
                                className="remove-button" 
                                onClick={() => handleRemoveItem(item.id)} // Call the remove function with the item ID
                            >
                                Remove
                            </button>                       
                             </div>
                    ))}
                </div>
            )}
             <div className="total-price-sidebar">
                    <h2>Total Price</h2>
                    <p>${totalPrice}</p>
                </div>
        </div>
        </div>
    );
};

export default Cart;