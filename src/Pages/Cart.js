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
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart/');
                setCart(response.data);
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
            await axiosInstance.delete(`/cart/${itemId}/`);
            const response = await axiosInstance.get('/cart/');
            setCart(response.data);
        } catch (err) {
            setError(err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error fetching cart items:</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.product.Price) * item.quantity);
    }, 0).toFixed(2);

    return (
        <div className="cart-container">
            {/* <div className="user-slider">
                <Slider {...settings}>
                    <div className="slides slide1">
                        <h2 className="text-background">Get Fit, Stay Healthy!</h2>
                        <img src="https://picsum.photos/200/300" alt="Slide 1" />
                    </div>
                    <div className="slides slide2">
                        <h2 className="text-background">Join Our Community</h2>
                        <img src="https://picsum.photos/200/301" alt="Slide 2" />
                    </div>
                    <div className="slides slide3">
                        <h2 className="text-background">Explore Our Programs</h2>
                        <img src="https://picsum.photos/200/302" alt="Slide 3" />
                    </div>
                </Slider>
            </div> */}
            <h1 className="cart-title">Your Cart</h1>
            <div className="cart-content">
                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty.</p>
                ) : (
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div className="cart-item-card" key={item.id}>
                                <img 
                                    src={`http://127.0.0.1:8000${item.product.images}`} 
                                    alt={item.product.product_name} 
                                    className="product-image" 
                                />
                                <div className="product-info">
                                    <h2 className="product-name">{item.product.product_name}</h2>
                                    <p className="product-quantity">Quantity: {item.quantity}</p>
                                    <p className="product-price">Price: ${parseFloat(item.product.Price).toFixed(2)}</p>
                                </div>
                                <button 
                                    className="remove-button" 
                                    onClick={() => handleRemoveItem(item.id)}
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
                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;