import './Home.css';
import PlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import { useState, useEffect } from 'react';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL basada en tu PlayerController - endpoint GET /players
    const URL = 'http://localhost:8080/players/public';
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Mapear los datos del backend al formato que espera PlayerCard
        const mappedPlayers = data.map(player => ({
          id: player.id,
          name: player.name,
          position: player.position,
          rating: player.rating,
          characteristics: player.characteristics ? player.characteristics.split(',') : [],
          price: player.price,
          isForSale: player.isForSale,
          image: player.image || '/images/default-player.png' // imagen por defecto si no tiene
        }));

        setPlayers(mappedPlayers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los jugadores:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

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

              {loading && (
                <div className="loading-message" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>Cargando jugadores...</p>
                </div>
              )}

              {error && (
                <div className="error-message" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                  <p>Error al cargar los jugadores: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '1rem'
                    }}
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}

              {!loading && !error && players.length === 0 && (
                <div className="no-players-message" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No hay jugadores disponibles</p>
                </div>
              )}

              {!loading && !error && players.length > 0 && (
                <div className="player-card-grid">
                  {players.map((player) => (
                    <PlayerCard
                      key={player.id}
                      name={player.name}
                      position={player.position}
                      rating={player.rating}
                      characteristics={player.characteristics}
                      price={player.price}
                      isForSale={player.isForSale}
                      image={player.image}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
