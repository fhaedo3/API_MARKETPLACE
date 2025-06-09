// src/views/Cart/Cart.jsx
import React from 'react';
import './Cart.css';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';

const Cart = () => {
  const playersInCart = [
    {
      id: 1,
      name: 'Messi',
      price: 105000,
      image: '/images/m.png',
      position: 'RW',
      rating: 91,
      characteristics: ['PAC 85', 'SHO 92', 'PAS 91'],
      isForSale: true,
    },
    {
      id: 2,
      name: 'Messi',
      price: 105000,
      image: '/images/m.png',
      position: 'RW',
      rating: 91,
      characteristics: ['PAC 85', 'SHO 92', 'PAS 91'],
      isForSale: true,
    },
  ];

  const subtotal = playersInCart.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="containerCart">
      <div className="cart-items">
        {playersInCart.map((player) => (
          <FifaPlayerCard
            key={player.id}
            name={player.name}
            position={player.position}
            rating={player.rating}
            price={player.price}
            image={player.image}
            characteristics={player.characteristics}
            isForSale={player.isForSale}
            compact={true}
          />
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-subtotal">
          Subtotal: ${subtotal.toLocaleString()}
        </div>
        <button className="btn-buy">Buy</button>
      </div>
    </div>
  );
};

export default Cart;
