// AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link из react-router-dom
import '../img/AboutPage.css'; // Импортируем файл стилей

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <h2>About Us</h2>
      <div className="about-text">
        <p>
          Welcome to AV.BY - your reliable partner in selling cars!
        </p>
        <p>
          We are a team of professionals dedicated to helping you sell your car quickly and efficiently. Our experience and expertise enable us to provide high-quality services for buying and selling cars.
        </p>
        <p>
          We understand that selling a car can be a complex process, so we offer simple and convenient solutions to help you get the best price for your car. We ensure maximum transparency and honesty at every stage of the transaction, so you can be confident in your success.
        </p>
        <p>
          Our specialists are always ready to assist you with any questions and provide the necessary information about the selling process. We strive to make your interaction with us as pleasant and comfortable as possible.
        </p>
        <p>
          Contact us today to start the process of selling your car or to receive a free consultation from our team of experts.
        </p>
      </div>
      <div className="contact-info">
        <p>
          Contact Information:
        </p>
        <p>
          Phone: +123456789
        </p>
        <p>
          Email: info@av.by
        </p>
      </div>
      {/* Заменяем кнопку на компонент Link */}
      <Link to="/" className="go-back-link">Go Back</Link>
    </div>
  );
};

export default AboutPage;
