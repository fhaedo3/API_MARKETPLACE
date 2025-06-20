import './PlayerList.css';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import PositionFilter from '../../components/PositionFilter/PositionFilter.jsx';
import { useState, useEffect } from 'react';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSaleStatus, setSelectedSaleStatus] = useState('');
  const [availablePositions, setAvailablePositions] = useState([]);

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
        console.log('Datos recibidos del backend:', data);

        const mappedPlayers = data.map(player => ({
          id: player.id ?? '',
          name: player.name ?? '',
          position: player.position ?? '',
          rating: player.rating ?? 0,
          characteristics: player.characteristics
            ? Array.isArray(player.characteristics)
              ? player.characteristics
              : player.characteristics.split(',').map(c => c.trim())
            : [],
          price: player.price ?? 0,
          isForSale: player.isForSale ?? false,
          image: player.image ?? ''
        }));

        setPlayers(mappedPlayers);
        setFilteredPlayers(mappedPlayers);

        const uniquePositions = [...new Set(mappedPlayers.map(p => p.position))];
        setAvailablePositions(uniquePositions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Efecto para aplicar ambos filtros
  useEffect(() => {
    let filtered = players;

    // Filtrar por posición
    if (selectedPosition !== '') {
      filtered = filtered.filter(p => p.position === selectedPosition);
    }

    // Filtrar por estado de venta
    if (selectedSaleStatus !== '') {
      if (selectedSaleStatus === 'for-sale') {
        filtered = filtered.filter(p => p.isForSale === true);
      } else if (selectedSaleStatus === 'not-for-sale') {
        filtered = filtered.filter(p => p.isForSale === false);
      }
    }

    setFilteredPlayers(filtered);
  }, [selectedPosition, selectedSaleStatus, players]);

  if (loading) return <p>Loading players...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="player-list-container">
      <h2>Available Players</h2>

      <div className="filters-container">
        <PositionFilter
          positions={availablePositions}
          selectedPosition={selectedPosition}
          onChange={setSelectedPosition}
        />

        <div className="sale-filter-container">
          <label htmlFor="sale-filter" className="sale-filter-label">
            Filter by State:
          </label>
          <select
            id="sale-filter"
            value={selectedSaleStatus}
            onChange={(e) => setSelectedSaleStatus(e.target.value)}
            className="sale-filter-select"
          >
            <option value="">All players</option>
            <option value="for-sale">For sale</option>
            <option value="not-for-sale">Not for sale</option>
          </select>
        </div>
      </div>

      <div className="player-list">
        {filteredPlayers.map(player => (
          <FifaPlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;