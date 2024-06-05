import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import '../img/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    number_of_post: "",
    brand_mark: "",
    description: "",
    mileage: "",
    year: "",
    price: "",
    city: "",
    photo: null,
    parametres: "",
    user: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [viewedHistory, setViewedHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("User is not authenticated");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(accessToken);

        if (!decodedToken || !decodedToken.id) {
          setError("Invalid token");
          setLoading(false);
          return;
        }

        const userId = decodedToken.id;

        console.log("User ID:", userId);

        const response = await axios.get(
          `http://127.0.0.1:8000/api/userprofiles/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("User data:", response.data);

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = user.id; // Получаем ID пользователя
        const response = await axios.get(
          `http://127.0.0.1:8000/api/userads/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserAds(response.data);
      } catch (error) {
        console.error("Error fetching user ads:", error);
        setError("Error fetching user ads");
      }
    };

    if (user) {
      fetchUserAds();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data"
      }
    };

    const formDataObject = new FormData();
    for (const key in formData) {
      // Если ключ - это 'user', сохраняем id пользователя, а не имя пользователя
      if (key === 'user') {
        formDataObject.append(key, user.id);
      } else {
        formDataObject.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/addcars/", formDataObject, config);
      console.log("Advertisement added:", response.data);
      // Очистить форму после успешного добавления
      setFormData({
        name: "",
        number_of_post: "",
        brand_mark: "",
        description: "",
        mileage: "",
        year: "",
        price: "",
        city: "",
        photo: null,
        parametres: "",
        user: ""
      });
    } catch (error) {
      console.error("Error adding advertisement:", error);
    }
  };

  useEffect(() => {
    // Загружаем историю просмотров из localStorage
    const viewed = JSON.parse(localStorage.getItem('viewedHistory')) || [];
    console.log('Viewed history:', viewed); // Добавим вывод просмотренной истории в консоль
    setViewedHistory(viewed);
  }, []);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p className="profile-label">Name:</p>
        <p className="profile-value">{user.username}</p>
      </div>
      <div className="profile-info">
        <p className="profile-label">Email:</p>
        <p className="profile-value">{user.email}</p>
      </div>
      {/* Кнопка для отображения формы */}
      <button className="add-ad-button" onClick={() => setShowForm(true)}>Add advertisement</button>
      {/* Форма для добавления объявления */}
      {showForm && (
        <form className="add-ad-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Title:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          <label htmlFor="user">Username:</label>
          <input type="text" id="user" name="user" value={user.username} disabled />
          <label htmlFor="number_of_post">Number of post:</label>
          <input type="text" id="number_of_post" name="number_of_post" value={formData.number_of_post} onChange={handleInputChange} required />
          <label htmlFor="brand_mark">Brand/mark:</label>
          <input type="text" id="brand_mark" name="brand_mark" value={formData.brand_mark} onChange={handleInputChange} required />
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          <label htmlFor="mileage">Mileage:</label>
          <input type="text" id="mileage" name="mileage" value={formData.mileage} onChange={handleInputChange} required />
          <label htmlFor="year">Year:</label>
          <input type="text" id="year" name="year" value={formData.year} onChange={handleInputChange} required />
          <label htmlFor="price">Price:</label>
          <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
          <label htmlFor="city">City:</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
          <label htmlFor="photo">Photo:</label>
          <input type="text" id="photo" name="photo" value={formData.photo} onChange={handleInputChange} required />
          <label htmlFor="parametres">Parametres:</label>
          <input type="text" id="parametres" name="parametres" value={formData.parametres} onChange={handleInputChange} required />
          {/* Добавьте другие поля формы */}
          <button type="submit">Submit</button>
        </form>
      )}
      <div className="user-ads">
        <h3>User Advertisements</h3>
        {userAds.length > 0 ? (
          userAds.map((ad) => (
            <div key={ad.id} className="user-ad">
              <h4>{ad.name}</h4>
              <p>{ad.description}</p>
              <b>{ad.price}$</b>
            </div>
          ))
        ) : (
          <p>No ads added yet. <Link to="/">Add your first ad</Link></p>
        )}
      </div>
      <div className="viewed-history">
        <h3>Viewed History</h3>
        <ul>
          {viewedHistory.map((item) => (
            <li key={item.id}>
              <Link to={`/cars/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/" className="go-back-link">Go Back</Link>
    </div>
  );
};

export default Profile;
