import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [playersDashboard, setPlayersDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Función para decodificar el JWT y obtener información del usuario
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Función para obtener información del usuario por username
  const getUserByUsername = async (username, token) => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status}`);
      }
      const users = await response.json();
      const user = users.find(u => u.username && u.username.trim().toLowerCase() === username.trim().toLowerCase());
      if (!user) {
        console.error('User not found. Username buscado:', username, 'Usernames en base:', users.map(u => u.username));
        throw new Error('User not found (username: ' + username + ')');
      }
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  // Función para obtener los jugadores del usuario
  const fetchUserPlayers = async (ownerId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/players/owner/${ownerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          console.log('User has no players yet');
          return [];
        }
        throw new Error(`Error fetching players: ${response.status}`);
      }
      const players = await response.json();
      if (!players || !Array.isArray(players)) {
        console.log('No players found or invalid response format');
        return [];
      }
      return players;
    } catch (error) {
      console.error('Error fetching user players:', error);
      if (error.message && error.message.includes('no tiene jugadores')) {
        console.log('User has no associated players');
        return [];
      }
      throw error;
    }
  };

  useEffect(() => {
    const loadUserPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found.');
          return;
        }
        const decodedToken = decodeToken(token);
        if (!decodedToken) {
          setError('Invalid authentication token.');
          return;
        }
        if (!decodedToken.sub) {
          setError('Invalid authentication token: no username.');
          return;
        }
        const userInfo = await getUserByUsername(decodedToken.sub, token);
        setUserInfo(userInfo);
        const players = await fetchUserPlayers(userInfo.id, token);
        const transformedPlayers = players.map(player => ({
          id: player.id,
          name: player.name,
          price: player.price,
          image: player.image || '/images/default-player.png',
          position: player.position,
          rating: player.rating,
          characteristics: player.characteristics || [],
          isForSale: player.isForSale || false,
        }));
        setPlayersDashboard(transformedPlayers);
        console.log(`Loaded ${transformedPlayers.length} players for userId ${userInfo.id}`);
      } catch (error) {
        console.error('Error loading user players:', error);
        setError(error.message || 'Error loading your players. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadUserPlayers();
  }, [navigate]);

  const totalValue = playersDashboard.reduce((sum, p) => sum + (p.price || 0), 0);
  const playersForSale = playersDashboard.filter(p => p.isForSale).length;
  const playersNotForSale = playersDashboard.length - playersForSale;

  if (loading) {
    return (
      <div className="containerDashboard">
        <div className="dashboard-loading">
          <h2>Loading your team...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="containerDashboard">
        <div className="dashboard-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="containerDashboard">
      {userInfo && (
        <>
          <h1 className="club-title">{userInfo.teamName}</h1>
          <div className="team-info" style={{ marginBottom: '2.5rem' }}>
            <p><strong>Stadium:</strong> {userInfo.stadium}</p>
            <p><strong>City:</strong> {userInfo.city}</p>
            <p><strong>Founded:</strong> {userInfo.yearFounded}</p>
            <p><strong>Total Players:</strong> {playersDashboard.length}</p>
            <p><strong>Players For Sale:</strong> {playersForSale}</p>
            <p><strong>Players Not For Sale:</strong> {playersNotForSale}</p>
            <p><strong>Total Squad Value:</strong> ${totalValue.toLocaleString()}</p>
          </div>
        </>
      )}
      {playersDashboard.length === 0 ? (
        <div className="no-players">
          <div className="no-players-icon">⚽</div>
          <h2>No Players Yet!</h2>
          <p>Your squad is empty. Time to build your dream team!</p>
          <p>Visit the marketplace to discover and purchase talented players.</p>
          <div className="no-players-actions">
            <button onClick={() => navigate('/marketplace')} className="marketplace-button">🏪 Browse Marketplace</button>
            <button onClick={() => window.location.reload()} className="refresh-button">🔄 Refresh</button>
          </div>
        </div>
      ) : (
        <div className="dashboard-items">
          {playersDashboard.map((player) => (
            <FifaPlayerCard
              key={player.id}
              id={player.id}
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
      )}
    </div>
  );
};

export default Dashboard;