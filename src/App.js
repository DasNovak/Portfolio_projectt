import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  // Import Link and BrowserRouter
//import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Items from "./components/Items";
import axios from "axios";
import CarFilter from "./components/CarFilter";
import RegistrationModal from "./components/RegistrationModal";
import Profile from "./components/Profile";
// import AuthenticationForm from "./components/AuthenticationForm";
// import LoginForm from "./components/LoginForm";
import AboutPage from "./components/AboutPage"; // Import AboutPage component
import ItemDetails from "./components/ItemDetails";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      error: null,
      loggedIn: false,
      userId: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/") // Указание конкретного эндпоинта
      .then(response => {
        this.setState({ items: response.data });
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  handleLogin(userData) {
    this.setState({ loggedIn: true, userId: userData.id });
  }

  handleLogout() {
    this.setState({ loggedIn: false, userId: null });
  }

  render() {
    const { loggedIn, items, error, userId } = this.state;

    return (
      <Router>
        <div className="wrapper">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <CarFilter apiUrl="http://127.0.0.1:8000/api/cars/filter/?brand_mark=&year=&min_price=&max_price=&" />
                {items.length > 0 && <Items items={items} />}
                {error && <p>Error: {error}</p>}
              </>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cars/:id" element={<ItemDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;

