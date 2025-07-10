import './Home.css';
import PlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlayers } from '../../store/slices/playerSlice';
import { selectAllPlayers, selectPlayersLoading, selectPlayersError } from '../../store/slices/playerSlice';
import { getPlayerImageUrl } from '../../utils/imageUtils';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const players = useSelector(selectAllPlayers);
  const loading = useSelector(selectPlayersLoading);
  const error = useSelector(selectPlayersError);

  // Local state para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Cargar jugadores al montar el componente
  useEffect(() => {
    dispatch(fetchAllPlayers());
  }, [dispatch]);

  // Filtrar jugadores cuando cambie el término de búsqueda o los jugadores
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers(players.slice(0, 12)); // Mostrar solo los primeros 12 en home
    } else {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered.slice(0, 12));
    }
  }, [players, searchTerm]);

  // Función para realizar la búsqueda
  const performSearch = useCallback((searchValue) => {
    console.log('Realizando búsqueda con:', searchValue); // Para debug
    console.log('Total de jugadores:', players.length); // Para debug

    if (!searchValue || searchValue.trim() === '') {
      setFilteredPlayers(players);
      setIsSearching(false);
      return;
    }

    const searchLower = searchValue.toLowerCase().trim();

    const filtered = players.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchLower);
      const positionMatch = player.position.toLowerCase().includes(searchLower);
      const characteristicsMatch = player.characteristics.some(char =>
        char.toLowerCase().includes(searchLower)
      );

      return nameMatch || positionMatch || characteristicsMatch;
    });

    console.log('Resultados filtrados:', filtered); // Para debug
    setFilteredPlayers(filtered);
    setIsSearching(true);
  }, [players]);

  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Búsqueda en tiempo real (opcional - puedes comentar esta línea si solo quieres búsqueda por botón)
    performSearch(value);
  };

  // Función para el botón de búsqueda
  const handleSearchSubmit = () => {
    console.log('Botón de búsqueda presionado con término:', searchTerm);
    performSearch(searchTerm);
  };

  // Función para manejar Enter en el input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    console.log('Limpiando búsqueda');
    setSearchTerm('');
    setIsSearching(false);
    setFilteredPlayers(players);
  };

  // Función para manejar click en jugador - redirige al login
  const handlePlayerClick = () => {
    navigate('/login'); // Redirigir a la página de login
  };

  return (
    <div className="home" >
      <div className="containerHome">
        {/* HERO SECTION */}
        <section className="hero" id="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <h1>ScoutMarket</h1>
              <h2>¡Best Place To Buy Or Sell Players!</h2>
              <p>See All The Data Of The Players</p>
            </div>
            <div className="hero-image-box">
              <img src="/images/FondoHome.png" alt="Hero players" />
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="services" id="services">
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
        <section className="how-to-use" id="how-to-use">
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
        <section className="best-players" id="best-players">
          <div className="player-container">
            <section className="player-grid-section">
              <h2 className="section-title">
                {isSearching ? `Search Results (${filteredPlayers.length})` : 'Top Players'}
              </h2>

              {/* Mensaje informativo para usuarios no logueados */}
              <div className="login-required-info" style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                margin: '1rem 0',
                color: '#856404'
              }}>
                <p><strong>🔒 Register/Login required to view player details</strong></p>
              </div>

              {isSearching && (
                <div className="search-info">
                  <p>Searching for: "<strong>{searchTerm}</strong>"</p>
                  <button onClick={clearSearch} className="clear-search-btn">
                    Show all players
                  </button>
                </div>
              )}

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

              {!loading && !error && filteredPlayers.length === 0 && isSearching && (
                <div className="no-results-message" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No se encontraron jugadores que coincidan con tu búsqueda: "<strong>{searchTerm}</strong>"</p>
                  <button onClick={clearSearch} className="clear-search-btn">
                    Ver todos los jugadores
                  </button>
                </div>
              )}

              {!loading && !error && filteredPlayers.length === 0 && !isSearching && (
                <div className="no-players-message" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>No hay jugadores disponibles</p>
                </div>
              )}

              {!loading && !error && filteredPlayers.length > 0 && (
                <div className="player-card-grid">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={handlePlayerClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <PlayerCard
                        player={player}
                        compact={false}
                        hideSaleBadge={false}
                      />
                    </div>
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
