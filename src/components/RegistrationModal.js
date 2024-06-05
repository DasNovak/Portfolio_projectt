import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hcaptcha from '@hcaptcha/react-hcaptcha';
import '../img/RegistrationModal.css';

const RegistrationModal = ({ onLogin, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUserData({
      username: "",
      email: "",
      password: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        user: userData,
        hcaptchaToken: hcaptchaToken
      };

      const endpoint = isRegistering ? 'register/' : 'register/login/';
      const response = await axios.post(`http://127.0.0.1:8000/api/${endpoint}`, requestData);

      localStorage.setItem('accessToken', response.data.token);
      onLogin(response.data.username);
      setIsLoggedIn(true);
      setSuccessMessage("Authentication successful!");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccessMessage("");
  };

  const handleHcaptchaChange = (token) => {
    setHcaptchaToken(token);
  };

  if (isLoggedIn) {
    return (
      <div>
        <p>You are already logged in.</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="registration-modal">
      <div className="registration-modal-content">
        <>
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          {error && <p>{error}</p>}
          {successMessage && <p>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="text" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
            </div>
            {isRegistering && (
              <>
                <div>
                  <label>Username:</label>
                  <input type="text" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} />
                </div>
              </>
            )}
            <Hcaptcha
              sitekey="c3745689-7554-46bc-9cc0-b701fa2700ea"
              onVerify={handleHcaptchaChange}
            />
            <button className="auth-button" type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button className="auth-button" onClick={handleToggleMode}>
              {isRegistering ? "Login here" : "Register here"}
            </button>
          </p>
        </>
      </div>
    </div>
  );
};

export default RegistrationModal;
