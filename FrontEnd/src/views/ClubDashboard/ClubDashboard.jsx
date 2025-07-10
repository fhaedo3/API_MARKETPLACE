import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import { fetchClubById } from '../../store/slices/clubSlice';
import { fetchPlayersByOwner } from '../../store/slices/playerSlice';
import { fetchUserByUsername } from '../../store/slices/clubSlice';
import './ClubDashboard.css';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { token, user: authUser, isAuthenticated } = useSelector(state => state.auth);
  const { currentClub, loading: clubLoading, error: clubError } = useSelector(state => state.clubs);
  const { userPlayers, loading: playersLoading, error: playersError } = useSelector(state => state.players);

  // Local state
  const [isOwnClub, setIsOwnClub] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Función para decodificar token
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

  // Obtener el userId del usuario logueado
  const getCurrentUserId = async () => {
    if (!token) return null;

    try {
      const decoded = decodeToken(token);
      const username = decoded.sub || decoded.username || decoded.name;
      if (!username) return null;

      // Usar Redux para obtener el usuario por username
      const result = await dispatch(fetchUserByUsername(username)).unwrap();
      return result.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  };

  // Verificar si es el club propio
  useEffect(() => {
    const checkOwnClub = async () => {
      if (isAuthenticated && token) {
        const userId = await getCurrentUserId();
        if (userId) {
          setCurrentUserId(userId);
          setIsOwnClub(userId.toString() === clubId);
        }
      }
    };

    checkOwnClub();
  }, [isAuthenticated, token, clubId]);

  // Fetch inicial de datos
  useEffect(() => {
    if (clubId) {
      // Fetch club information
      dispatch(fetchClubById(clubId));

      // Fetch players for this club
      dispatch(fetchPlayersByOwner(clubId));
    }
  }, [clubId, dispatch]);

  const handleManagePlayersClick = () => {
    navigate('/manage-my-players');
  };

  const handleRetryClub = () => {
    if (clubId) {
      dispatch(fetchClubById(clubId));
    }
  };

  const handleRetryPlayers = () => {
    if (clubId) {
      dispatch(fetchPlayersByOwner(clubId));
    }
  };

  // Loading states
  if (clubLoading) {
    return (
      <div className="club-dashboard">
        <h2>Loading club...</h2>
      </div>
    );
  }

  // Error states
  if (clubError) {
    return (
      <div className="club-dashboard">
        <h2>Error: {clubError}</h2>
        <button onClick={handleRetryClub}>Retry</button>
      </div>
    );
  }

  if (!currentClub) {
    return (
      <div className="club-dashboard">
        <h2>Club not found</h2>
        <button onClick={() => navigate('/clubs')}>Back to Clubs</button>
      </div>
    );
  }

  // Imagen del club
  const clubImage = `/images/Club/${currentClub.teamName?.replace(/\s/g, '_')}/logo.png`;
  const fallbackImage = '/images/Logo.png';

  return (
    <div className="club-dashboard">
      <div className="club-header">
        <div className="club-info">
          <img
            src={clubImage}
            alt={currentClub.teamName || currentClub.username}
            className="club-logo"
            onError={e => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#fff',
              border: '4px solid #FFC75F',
              marginBottom: 16
            }}
          />

          <h1 className="club-name">
            {currentClub.teamName || currentClub.clubName || currentClub.username || 'Unknown Club'}
          </h1>

          <div className="club-details">
            <p><strong>Manager:</strong> {currentClub.username}</p>
            <p><strong>Founded:</strong> {currentClub.yearFounded || 'Unknown'}</p>
            <p><strong>Stadium:</strong> {currentClub.stadium || 'Unknown'}</p>
            <p><strong>City:</strong> {currentClub.city || 'Unknown'}</p>
            <p><strong>Email:</strong> {currentClub.email || 'Unknown'}</p>
            <p><strong>Players:</strong> {userPlayers.length}</p>
            <p><strong>Players for sale:</strong> {userPlayers.filter(p => p.isForSale).length}</p>
          </div>
        </div>

        {isOwnClub && (
          <div className="club-actions">
            <button
              className="manage-btn"
              onClick={handleManagePlayersClick}
            >
              Manage My Players
            </button>
          </div>
        )}
      </div>

      <div className="club-players-section">
        <h2>Squad</h2>

        {playersLoading ? (
          <div className="loading-players">
            <p>Loading players...</p>
          </div>
        ) : playersError ? (
          <div className="error-players">
            <p>Error loading players: {playersError}</p>
            <button onClick={handleRetryPlayers}>Retry</button>
          </div>
        ) : userPlayers.length === 0 ? (
          <p className="no-players">This club has no players yet.</p>
        ) : (
          <div className="players-grid">
            {userPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                clubName={currentClub.teamName || currentClub.clubName || currentClub.username || 'Unknown Club'}
                compact={false}
              />
            ))}
          </div>
        )}
      </div>

      {!isOwnClub && (
        <div className="club-note">
          <p>
            This is {currentClub.teamName || currentClub.clubName || currentClub.username}'s club dashboard.
            You can view their players but cannot edit them.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClubDashboard;