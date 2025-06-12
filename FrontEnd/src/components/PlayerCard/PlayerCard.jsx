import React from 'react';
import { useNavigate } from 'react-router-dom';
import './playerCard.css';

const FifaPlayerCard = ({ player, compact = false }) => {
  const {
    name,
    position,
    rating,
    characteristics,
    price,
    isForSale,
    image,
    id
  } = player || {};

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/player/${id}`);
  };

  return (
    <div className="fifa-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={`fifa-sale-badge ${isForSale ? 'for-sale' : 'not-for-sale'}`}>
        {isForSale ? 'FOR SALE' : 'NOT FOR SALE'}
      </div>
      <div className="fifa-rating">{rating}</div>
      <img src={image} alt={name} className="fifa-player-image" />

      <h2 className="fifa-name">{name}</h2>
      <p className="fifa-position">{position}</p>

      {!compact && (
        <ul className="fifa-characteristics">
          {Array.isArray(characteristics) &&
            characteristics.map((charac, index) => (
              <li key={index}>• {charac}</li>
            ))}
        </ul>
      )}

      <div className="fifa-price">${price}</div>
    </div>
  );
};

export default FifaPlayerCard;