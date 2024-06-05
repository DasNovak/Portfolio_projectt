import React, { useState } from "react";
import axios from "axios";
import Hcaptcha from '@hcaptcha/react-hcaptcha';

const AuthenticationForm = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setError("Please complete the hCaptcha");
      return;
    }
    try {
      if (loggedIn) {
        // Обработка выхода пользователя
        setLoggedIn(false);
      } else {
        const response = isLogin
          ? await axios.post("http://127.0.0.1:8000/api/login/", { user, password, captchaToken })
          : await axios.post("http://127.0.0.1:8000/api/register/", { user, password, phone_number, location, captchaToken });

      console.log(response.data);

      if (!isLogin) {
        onLogin(response.data);
      } else {
        setLoggedIn(true);
      }
    }
  }catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
  };

  function toggleForm() {
    setIsLogin(!isLogin);
    setError(null);
  }

  return (
    <div>
      {loggedIn ? (
        <div>
          <h2>Welcome, {user}!</h2>
          <p>Phone Number: {phone_number}</p>
          <p>Location: {location}</p>
          <button onClick={handleSubmit}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>User:</label>
              <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label>Phone Number:</label>
                  <input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div>
                  <label>Location:</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <Hcaptcha
                sitekey="c3745689-7554-46bc-9cc0-b701fa2700ea"
                onVerify={handleCaptchaChange}
              />
            </div>
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm}>
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthenticationForm;
