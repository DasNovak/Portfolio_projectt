import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Item from './Item';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../img/ItemDetails.css'; // Импортируем файл стилей для компонента

const ItemDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userExists, setUserExists] = useState(true); // Булевое значение для проверки существования пользователя
  const [viewedHistory, setViewedHistory] = useState([]);

  const addToViewedHistory = (car) => {
    const updatedHistory = [...viewedHistory, { id: car.id, name: car.name }];
    localStorage.setItem('viewedHistory', JSON.stringify(updatedHistory));
    setViewedHistory(updatedHistory);
  };

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/cars/${id}/`);
        setCar(response.data);

        const viewedHistory = JSON.parse(localStorage.getItem('viewedHistory')) || [];
        const alreadyViewed = viewedHistory.some(item => item.id === id);

        // Если объявление еще не было просмотрено, добавляем его в историю
        if (!alreadyViewed) {
          const updatedHistory = [...viewedHistory, { id: response.data.id, name: response.data.name }];
          localStorage.setItem('viewedHistory', JSON.stringify(updatedHistory));
          console.log('Viewed history updated:', updatedHistory);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Error fetching car details');
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]);



  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        setLoading(true);
        console.log("Fetching user email...");
        if (car.user) {
          const response = await axios.get(`http://127.0.0.1:8000/api/userprofiles/${car.user}/`);
          console.log("User email response:", response.data.email);
          setUserEmail(response.data.email);
          setUserExists(true); // Устанавливаем, что пользователь существует
        } else {
          console.log("User not found for car:", car.id);
          setUserExists(false); // Устанавливаем, что пользователь не существует
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user email:', error);
        setError('Error fetching user email');
        setUserExists(false); // Устанавливаем значение в false, если пользователь не найден
        setLoading(false);
      }
    };

    if (car) {
      fetchUserEmail();
    }
  }, [car]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!car) {
    return <p>No car found</p>;
  }

  return (
    <div className="item-details-container">
      <h1 className="item-details-heading">Car Details</h1>
      <div className="item-details">
        <div className="item-details-info">
          <p><span>Name:</span> {car.name}</p>
          <p><span>Number of Post:</span> {car.number_of_post}</p>
          <p><span>Brand/Model:</span> {car.model}</p>
          <p><span>Description:</span> {car.description}</p>
          <p><span>Mileage:</span> {car.mileage}</p>
          <p><span>Year:</span> {car.year}</p>
          <p><span>Price:</span> {car.price}$</p>
          <p><span>City:</span> {car.city}</p>
          <p><span>Parametres:</span> {car.parametres}</p>
          {userExists && <p><span>User:</span> {userEmail}</p>} {/* Проверяем, существует ли пользователь */}
          {!userExists && <p><span>User:</span> Not available</p>} {/* Отображаем "Not available", если пользователь не найден */}
        </div>
        <div className="item-details-image">
          <img src={car.photo.startsWith('http') ? car.photo : "./img/" + car.photo} alt="Car" />
        </div>
      </div>
      <Link to="/" className="go-back-button">Go Back</Link>
    </div>
  );
};

export default ItemDetails;
