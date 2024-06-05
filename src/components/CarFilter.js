import React, { useState } from 'react';
import axios from 'axios';
import Items from './Items'; // Импортируем компонент Items
import '../img/CarFilter.css'; // Импортируем файл стилей для компонента

const CarFilter = ({ apiUrl }) => {
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFilterChange = () => {
    axios.get(apiUrl, {
      params: {
        brand_mark: brand,
        min_price: minPrice,
        max_price: maxPrice,
        year: minYear,
      }
    })
    .then(response => {
      setFilteredCars(response.data);
      setErrorMessage('');
    })
    .catch(error => {
      setErrorMessage('Error in filtration. Please try again.');
      setFilteredCars([]);
    });
  };

  return (
    <div className="carfilter">
      <h3>Filter of cars:</h3>
      <div className="carfilter-inputs">
        <input
          type="text"
          placeholder="Brand and mark"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="carfilter-input"
        />
        <input
          type="text"
          placeholder="Minimal price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="carfilter-input"
        />
        <input
          type="text"
          placeholder="Maximum price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="carfilter-input"
        />
        <input
          type="text"
          placeholder="Year"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
          className="carfilter-input"
        />
      </div>
      <button onClick={handleFilterChange} className="carfilter-button">Submit</button>
      {errorMessage && <p>{errorMessage}</p>}
      <Items items={filteredCars} />
    </div>
  );
};

export default CarFilter;
