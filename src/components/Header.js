// Header.js
import React, { useState } from "react";
import AuthenticationForm from "./AuthenticationForm";
import CarFilter from "./CarFilter";
import RegistrationModal from "./RegistrationModal";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import "../img/Header.css";

export default function Header({ onLogin }) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showCarFilter, setShowCarFilter] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleAuthForm = () => {
    setShowAuthForm(!showAuthForm);
    setShowRegistrationModal(false);
  };

  const toggleCarFilter = () => {
    setShowCarFilter(!showCarFilter);
  };

  const toggleRegistrationModal = () => {
    setShowRegistrationModal(!showRegistrationModal);
  };

  const handleRegistrationSuccess = (userData) => {
    console.log("Пользователь зарегистрирован:", userData);
    setShowRegistrationModal(false);
    onLogin(userData);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleAdvertisementsClick = () => {
    const advertisementsSection = document.getElementById("advertisements");
    if (advertisementsSection) {
      advertisementsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="av-header">
      <div className="av-header-container">
        <span className="av-logo">AV.BY</span>
        <ul className="av-nav">
          <li>
            <Link to="/about">About us</Link>
          </li>
          <li>
            <span onClick={handleAdvertisementsClick}>Advertisements</span>
          </li>
          <li onClick={toggleCarFilter}>Filters</li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
        <button className="av-login-btn" onClick={toggleRegistrationModal}>
          Sign up/Log in
        </button>
        {showAuthForm && (
          <AuthenticationForm onLogin={onLogin} onClose={toggleAuthForm} />
        )}
        {showCarFilter && (
          <CarFilter
            apiUrl="http://127.0.0.1:8000/api/cars/filter/?brand_mark=&year=&min_price=&max_price=&"
          />
        )}
        {showRegistrationModal && (
          <RegistrationModal
            onLogin={handleRegistrationSuccess}
            onClose={toggleRegistrationModal}
          />
        )}
        {showProfile && <Profile />}
      </div>
      <div className="av-presentation"></div>
    </header>
  );
}
