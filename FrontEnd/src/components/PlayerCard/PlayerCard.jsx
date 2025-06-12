import React from 'react';
import { useNavigate } from 'react-router-dom';
import './playerCard.css';

const FifaPlayerCard = ({ player, compact = false, hideSaleBadge = false }) => {
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

  // Volver a la lógica anterior: solo usar image o la genérica
  const playerImage = image && image.length > 0 ? image : '/images/nn.png';

  return (
    <div className="fifa-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {!hideSaleBadge && (
        <div className={`fifa-sale-badge ${isForSale ? 'for-sale' : 'not-for-sale'}`}>
          {isForSale ? 'FOR SALE' : 'NOT FOR SALE'}
        </div>
      )}
      <div className="fifa-rating">{rating}</div>
      <img src={playerImage} alt={name} className="fifa-player-image" />

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