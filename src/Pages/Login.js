import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                email,
                password,
            });

            // Save the access token in local storage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Get user role from the response
            const userRole = response.data.user.role; // Access the role from the user object

            // Check user role and redirect accordingly
            if (userRole === 'admin') {
                navigate('/admin-dashboard'); // Redirect to admin dashboard
            } else if (userRole === 'user') {
                navigate('/buy-it'); // Redirect to user dashboard
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || 'Login failed');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('contact_number', contactNumber);
        if (profilePhoto) {
            formData.append('profile_photo', profilePhoto);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMessage('Registration successful! You can now log in.');
            console.log('Registration successful:', response.data);
            setIsRegistering(false); // Toggle back to login form
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || 'Registration failed');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                    {isRegistering && (
                        <>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Number:</label>
                                <input
                                    type="text"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Profile Photo:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
                <p>
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                        {isRegistering ? 'Login here' : 'Register here'}
                    </span>
                </p>
                <a href='/'>Go To HomePage</a>
            </div>
        </div>
    );
};

export default Login;