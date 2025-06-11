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

  // Función para obtener información del usuario por email
  const getUserByEmail = async (email, token) => {
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
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  // Función para obtener los jugadores del usuario
  const fetchUserPlayers = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}/players`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Si es un 404 o el usuario no tiene jugadores, retornar array vacío
        if (response.status === 404) {
          console.log('User has no players yet');
          return [];
        }
        throw new Error(`Error fetching players: ${response.status}`);
      }

      const players = await response.json();

      // Manejar casos donde la respuesta podría ser null, undefined o no un array
      if (!players || !Array.isArray(players)) {
        console.log('No players found or invalid response format');
        return [];
      }

      return players;
    } catch (error) {
      console.error('Error fetching user players:', error);

      // Si el error es relacionado con "no tiene jugadores asociados", retornar array vacío
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

        // Obtener token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No authentication token found.');
          return;
        }

        // Decodificar token para obtener información del usuario
        const decodedToken = decodeToken(token);

        if (!decodedToken || !decodedToken.sub) {
          setError('Invalid authentication token.');
          return;
        }

        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setError('Authentication token has expired.');
          return;
        }

        // Obtener información completa del usuario
        const userInfo = await getUserByEmail(decodedToken.sub, token);
        setUserInfo(userInfo);

        // Obtener jugadores del usuario
        const players = await fetchUserPlayers(userInfo.id, token);

        // Transformar datos si es necesario para que coincidan con el componente PlayerCard
        const transformedPlayers = players.map(player => ({
          id: player.id,
          name: player.name,
          price: player.price,
          image: player.image || '/images/default-player.png', // imagen por defecto si no tiene
          position: player.position,
          rating: player.rating,
          characteristics: player.characteristics || [],
          isForSale: player.isForSale || false,
        }));

        setPlayersDashboard(transformedPlayers);

        // Log para debugging
        console.log(`Loaded ${transformedPlayers.length} players for user ${userInfo.teamName}`);

      } catch (error) {
        console.error('Error loading user players:', error);

        // Manejar diferentes tipos de errores
        if (error.message && (
          error.message.includes('no tiene jugadores') ||
          error.message.includes('No players found') ||
          error.message.includes('404')
        )) {
          // Si es un error de "no tiene jugadores", no mostrar error, sino array vacío
          setPlayersDashboard([]);
          console.log('User has no players - showing empty state');
        } else {
          setError(error.message || 'Error loading your players. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserPlayers();
  }, [navigate]);

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
      <h1 className="dashboard-title">
        {userInfo ? `${userInfo.teamName}'s Squad` : 'My Team'}
      </h1>

      {playersDashboard.length === 0 ? (
        <div className="no-players">
          <div className="no-players-icon">
            ⚽
          </div>
          <h2>No Players Yet!</h2>
          <p>Your squad is empty. Time to build your dream team!</p>
          <p>Visit the marketplace to discover and purchase talented players.</p>
          <div className="no-players-actions">
            <button
              onClick={() => navigate('/marketplace')}
              className="marketplace-button"
            >
              🏪 Browse Marketplace
            </button>
            <button
              onClick={() => window.location.reload()}
              className="refresh-button"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-items">
          {playersDashboard.map((player) => (
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
      )}

      {userInfo && (
        <div className="team-info">
          <h3>Team Information</h3>
          <p><strong>Stadium:</strong> {userInfo.stadium}</p>
          <p><strong>City:</strong> {userInfo.city}</p>
          <p><strong>Founded:</strong> {userInfo.yearFounded}</p>
          <p><strong>Total Players:</strong> {playersDashboard.length}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;