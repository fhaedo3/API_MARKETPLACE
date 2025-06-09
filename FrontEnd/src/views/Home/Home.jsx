import './Home.css';
import PlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import { useState } from 'react';

const Home = () => {
  const mockPlayers = [
    {
      name: 'Lionel Messi',
      position: 'RW',
      rating: 93,
      characteristics: ['Pace 85', 'Dribbling 96', 'Passing 91', 'Shooting 92'],
      price: 10000000,
      isForSale: true,
      image: '/images/m.png',
    },
    {
      name: 'Sergio Ramos',
      position: 'ST',
      rating: 91,
      characteristics: ['Pace 87', 'Shooting 94', 'Heading 85', 'Dribbling 89'],
      price: 9000000,
      isForSale: false,
      image: '/images/sergioramos.png',
    },
    {
      name: 'Vinicius Jr.',
      position: 'LW',
      rating: 92,
      characteristics: ['Pace 97', 'Dribbling 92', 'Shooting 88', 'Passing 84'],
      price: 12000000,
      isForSale: true,
      image: '/images/vinicius.png',
    },
    {
      name: 'Juan Roman Riquelme.',
      position: 'LW',
      rating: 92,
      characteristics: ['Pace 97', 'Dribbling 92', 'Shooting 88', 'Passing 84'],
      price: 12000000,
      isForSale: true,
      image: '/images/riquelme.png',
    },
  ];

  return (
    <div className="home">
      <div className="containerHome">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <h1>ScoutMarket</h1>
              <h2>Best Place To Buy Or Sell Players!!!</h2>
              <p>See All The Data Of The Players</p>

              <div className="hero-search">
                <input
                  type="text"
                  placeholder="Search To Find"
                  className="hero-search-input"
                />
                <button className="hero-search-btn">🔍</button>
              </div>
            </div>
            <div className="hero-image-box">
              <img src="/images/FondoHome.png" alt="Hero players" />
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="services">
          <div className="containerHome">
            <div className="services-header">
              <h3>Most Popular Services</h3>
              <span className="services-icon">📈</span>
            </div>
            <div className="services-grid">
              <div className="service-card">BUY</div>
              <div className="service-card">SELL</div>
              <div className="service-card">BORROWING</div>
              <div className="service-card">TRADE</div>
            </div>
          </div>
        </section>

        {/* HOW TO USE */}
        <section className="how-to-use">
          <div className="how-to-use-inner">
            <h3>How To Use:</h3>
            <div className="how-to-use-box">
              <div className="how-to-use-steps">
                <div className="step">✔️ Search For A Player</div>
                <div className="step">✔️ Make An Offer</div>
                <div className="step selected">✔️ Sign A Contract</div>
              </div>
              <div className="how-to-use-image">
                <img src="/images/HowToUse.png" alt="How to use visual" />
              </div>
            </div>
          </div>
        </section>

        {/* BEST PLAYERS */}
        <section className="best-players">
          <div className="player-container">
            <section className="player-grid-section">
              <h2 className="section-title">Top Players</h2>
              <div className="player-card-grid">
                {mockPlayers.map((player, index) => (
                  <PlayerCard key={index} {...player} />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
