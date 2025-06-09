// src/components/PlayerCard/PlayerCard.jsx
import React from 'react';
import './playerCard.css';

const FifaPlayerCard = ({
  name,
  position,
  rating,
  characteristics,
  price,
  isForSale,
  image,
  compact = false // OCULTA EL FOR SALE
}) => {
  return (
    <div className="fifa-card">
      {!compact && (
        <div className={`fifa-sale-badge ${isForSale ? 'for-sale' : 'not-for-sale'}`}>
          {isForSale ? 'FOR SALE' : 'NOT FOR SALE'}
        </div>
      )}

      <div className="fifa-rating">{rating}</div>
      <img src={image} alt={name} className="fifa-player-image" />

      <h2 className="fifa-name">{name}</h2>
      <p className="fifa-position">{position}</p>

      {!compact && (
        <ul className="fifa-characteristics">
          {characteristics.map((charac, index) => (
            <li key={index}>• {charac}</li>
          ))}
        </ul>
      )}

      <div className="fifa-price">${price}</div>
    </div>
  );
};

export default FifaPlayerCard;