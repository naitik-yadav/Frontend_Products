import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set the duration for each slide (in milliseconds)
  };

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); 
    };

  return (
    <div className="homepage">
      <header className="header-container">
    <img src='logo.jpg' alt="Gym World Logo" className="logo" /> 
    <h1 className='heading'>Welcome to Gym World</h1>
    <button className="login-button" onClick={handleLoginClick}>
        Login
    </button>
</header>
      <div className="slider-container">
      <Slider {...settings}>
  <div className="slide slide1">
    <h2 className="text-background">Get Fit, Stay Healthy!</h2>
    <p className="text-background">Your journey to fitness starts here.</p>
    {/* <button className="cta-button">Get Started</button> */}
  </div>
  <div className="slide slide2">
    <h2 className="text-background">Join Our Community</h2>
    <p className="text-background">Connect with fitness enthusiasts and trainers.</p>
    {/* <button className="cta-button">Join Now</button> */}
  </div>
  <div className="slide slide3">
    <h2 className="text-background">Explore Our Programs</h2>
    <p className="text-background">Find the right program for your fitness goals.</p>
    {/* <button className="cta-button">View Programs</button> */}
  </div>
</Slider>
      </div>
      <div className="content">
        <h2>About Us</h2>
        <div class="welcome-section">
  <h2>Welcome to GYM WORLD</h2>
  <p>
    Your ultimate destination for high-quality fitness products designed to elevate your workout experience. Whether you're an athlete, a fitness enthusiast, or just beginning your journey, we are here to support your goals with premium supplements, stylish and durable gym apparel, and cutting-edge accessories.
  </p>
  <p>
    At GYM WORLD, we believe that fitness is not just a routine—it’s a lifestyle. That’s why we are committed to offering products that combine performance, innovation, and style. From scientifically formulated supplements to enhance your energy and recovery, to apparel that fits and performs perfectly, we ensure every product meets the highest standards of quality and functionality.
  </p>
  <p>
    Our mission is simple: to empower you to achieve your fitness goals with confidence and ease. We are passionate about health and wellness, and we strive to inspire you to push your limits, stay consistent, and enjoy the journey.
  </p>
  <h2>Why Choose Us?</h2>
  <ul>
    <li>Top-Quality Products: Carefully curated and rigorously tested for performance and reliability.</li>
    <li>Customer-Centric Service: Your satisfaction and success are our priorities.</li>
    <li>Passion for Fitness: We live and breathe fitness, just like you.</li>
  </ul>
  <p>
    Join our community today and take your fitness journey to the next level!
  </p>
</div>
      </div>
      <div className="testimonials">
        <h2>What Our Members Say</h2>
        <Slider {...settings}>
          <div>
            <img src="/testi-1.jpeg" alt="Alex" className="testimonial-image" />
            <p>"Gym World has transformed my fitness journey!"</p>
            <span>- Alex</span>
          </div>
          <div>
            <img src="/testi-2.jpeg" alt="Jamie" className="testimonial-image" />
            <p>"The community support is amazing!"</p>
            <span>- Jamie</span>
          </div>
          {/* Add more slides as needed */}
        </Slider>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Gym World. All rights reserved.</p>
          <ul className="footer-links">
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;