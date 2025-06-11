import './PlayerDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/players/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          if (response.status === 404) {
            setPlayer(null);
            setLoading(false);
            return;
          }
          throw new Error('Error fetching player details');
        }
        const data = await response.json();
        // Parse characteristics if needed
        data.characteristics = data.characteristics
          ? (Array.isArray(data.characteristics)
              ? data.characteristics
              : data.characteristics.split(',').map(c => c.trim()))
          : [];
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) return <div className="player-detail"><h2>Loading player...</h2></div>;
  if (error) return <div className="player-detail"><h2>Error: {error}</h2></div>;
  if (!player) return <div className="player-detail"><h2>Player not found</h2></div>;

  return (
    <div className="player-detail">
      <div className="player-header">
        <img src={player.image || '/images/default-player.png'} alt={player.name} className="player-image" />
        <h1 className="player-name">{player.name}</h1>
      </div>
      <div className="player-bio">
        <p><strong>Position:</strong> {player.position}</p>
        <p><strong>Rating:</strong> {player.rating}</p>
        <p><strong>Price:</strong> ${player.price}</p>
        <p><strong>Status:</strong> {player.isForSale ? 'FOR SALE' : 'NOT FOR SALE'}</p>
      </div>
      <div className="player-info">
        <p><strong>Characteristics:</strong></p>
        <ul>
          {player.characteristics.map((charac, idx) => (
            <li key={idx}>{charac}</li>
          ))}
        </ul>
      </div>
      <div className="player-actions">
        {player.isForSale && (
          <button className="buy-button">Buy</button>
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
