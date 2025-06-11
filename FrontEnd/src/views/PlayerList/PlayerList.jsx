import './PlayerList.css';
import PlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import { useState, useEffect, useCallback } from 'react';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const URL = 'http://localhost:8080/players/public';
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos del backend:', data); // Para debug

        // Mapear los datos del backend al formato que espera PlayerCard
        const mappedPlayers = data.map(player => ({
          id: player.id,
          name: player.name || '',
          position: player.position || '',
          rating: player.rating || 0,
          characteristics: player.characteristics ?
            (Array.isArray(player.characteristics) ?
              player.characteristics :
              player.characteristics.split(',').map(c => c.trim())
            ) : [],
          price: player.price || 0,
          isForSale: player.isForSale || false,
          image: player.image || '/images/default-player.png'
        }));

        console.log('Jugadores mapeados:', mappedPlayers); // Para debug
        setPlayers(mappedPlayers);
        setFilteredPlayers(mappedPlayers);
        setError(null);
      } catch (error) {
        console.error("Error al cargar los jugadores:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

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

  return (
    <div className="PlayerList" >
      <div className="containerPlayerList">
        {/* BEST PLAYERS */}
        <section className="best-players" id="best-players">
          <div className="player-container">
            <section className="player-grid-section">
              <h2 className="section-title">
                {isSearching ? `Search Results (${filteredPlayers.length})` : 'Top Players'}
              </h2>

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
                    <PlayerCard
                      key={player.id}
                      id={player.id}
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
         {/* SEARCHED PLAYERS */}
        <div className="containerplayerList">
            <h1 className="playerList-title">Your Results: </h1>
        <div className="playerList-items">
  

            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;