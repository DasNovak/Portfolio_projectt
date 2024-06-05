// Items.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../img/Items.css'; // Импортируем файл стилей

class Items extends Component {
  render() {
    return (
      <main id="advertisements">
        {this.props.items.map((el, index) => (
          <div key={index} className="item">
            <img src={el.photo.startsWith('http') ? el.photo : "./img/" + el.photo} alt="Product" />
            <h2>{el.name}</h2>
            <p>{el.description}</p>
            <b>{el.price}$</b>
            {/* Применяем класс для красивой кнопки */}
            <Link to={`/cars/${el.id}`} className="view-details-button">View Details</Link>
          </div>
        ))}
      </main>
    );
  }
}

export default Items;
