import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';
import './Dashboard.css';
import { getPlayerImageUrl } from '../../utils/imageUtils';
import { fetchCurrentUser, selectUserProfile, selectUserLoading, selectUserError } from '../../store/slices/userSlice';
import { fetchPlayersByOwner, selectUserPlayers, selectPlayersLoading, selectPlayersError } from '../../store/slices/playerSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const { token, isAuthenticated } = useSelector(state => state.auth);
  const userInfo = useSelector(selectUserProfile);
  const userLoading = useSelector(selectUserLoading);
  const userError = useSelector(selectUserError);
  const userPlayers = useSelector(selectUserPlayers);
  const playersLoading = useSelector(selectPlayersLoading);
  const playersError = useSelector(selectPlayersError);

  // Local state
  const [successMessage, setSuccessMessage] = useState(null);

  // Memoized values
  const isLoading = useMemo(() => userLoading || playersLoading, [userLoading, playersLoading]);
  const error = useMemo(() => userError || playersError, [userError, playersError]);
  const isAuthenticated_ = useMemo(() => isAuthenticated && token, [isAuthenticated, token]);

  // Transform user players data for dashboard
  const playersDashboard = useMemo(() => {
    if (!userPlayers || !Array.isArray(userPlayers)) return [];

    return userPlayers.map(player => {
      // Safe characteristics parsing
      let characteristics = [];
      if (Array.isArray(player.characteristics)) {
        characteristics = player.characteristics;
      } else if (typeof player.characteristics === 'string' && player.characteristics.trim()) {
        characteristics = player.characteristics.split(',').map(c => c.trim()).filter(c => c);
      }

      return {
        id: player.id,
        name: player.name || 'Unknown Player',
        price: player.price || 0,
        image: getPlayerImageUrl(player),
        position: player.position || 'Unknown',
        rating: player.rating || 0,
        characteristics,
        isForSale: Boolean(player.isForSale),
        ownerId: player.ownerId || player.owner?.id || null
      };
    });
  }, [userPlayers]);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const totalValue = playersDashboard.reduce((sum, p) => sum + p.price, 0);
    const playersForSale = playersDashboard.filter(p => p.isForSale).length;
    const playersNotForSale = playersDashboard.length - playersForSale;

    return {
      totalValue,
      playersForSale,
      playersNotForSale,
      totalPlayers: playersDashboard.length
    };
  }, [playersDashboard]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (userInfo?.id) {
      dispatch(fetchPlayersByOwner(userInfo.id));
    } else {
      dispatch(fetchCurrentUser());
    }
  }, [userInfo?.id, dispatch]);

  // Clear success message
  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  // Navigation handlers
  const navigateToMarketplace = useCallback(() => navigate('/players'), [navigate]);
  const navigateToManagePlayers = useCallback(() => navigate('/manage-my-players'), [navigate]);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated_) {
      navigate('/login');
    }
  }, [isAuthenticated_, navigate]);

  // Fetch current user data
  useEffect(() => {
    if (isAuthenticated_ && !userInfo) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated_, userInfo, dispatch]);

  // Fetch user players when user info is available
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(fetchPlayersByOwner(userInfo.id));
    }
  }, [userInfo?.id, dispatch]);

  // Handle success messages from location state
  useEffect(() => {
    const message = location.state?.successMessage;
    if (message) {
      setSuccessMessage(message);

      // Auto-clear after 5 seconds
      const timer = setTimeout(clearSuccessMessage, 5000);

      // Clean up state - use navigate to replace state
      navigate(location.pathname, { replace: true });

      return () => clearTimeout(timer);
    }
  }, [location.state?.successMessage, location.pathname, navigate, clearSuccessMessage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="containerDashboard">
        <div className="dashboard-loading">
          <h2>Loading your team...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="containerDashboard">
        <div className="dashboard-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No user info state
  if (!userInfo) {
    return (
      <div className="containerDashboard">
        <div className="dashboard-error">
          <h2>User information not available</h2>
          <p>Please try logging in again.</p>
          <button onClick={() => navigate('/login')} className="retry-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="containerDashboard">
      <h1 className="club-title">{userInfo.teamName || userInfo.clubName || userInfo.username}</h1>

      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          <div className="success-content">
            <span className="success-icon">🎉</span>
            <p>{successMessage}</p>
            <button onClick={clearSuccessMessage} className="close-success">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="team-info" style={{ marginBottom: '2.5rem' }}>
        <p><strong>Stadium:</strong> {userInfo.stadium || 'Unknown'}</p>
        <p><strong>City:</strong> {userInfo.city || 'Unknown'}</p>
        <p><strong>Founded:</strong> {userInfo.yearFounded || 'Unknown'}</p>
        <p><strong>Total Players:</strong> {dashboardStats.totalPlayers}</p>
        <p><strong>Players For Sale:</strong> {dashboardStats.playersForSale}</p>
        <p><strong>Players Not For Sale:</strong> {dashboardStats.playersNotForSale}</p>
        <p><strong>Total Squad Value:</strong> ${dashboardStats.totalValue.toLocaleString()}</p>
        <div className="dashboard-actions">
          <button onClick={navigateToManagePlayers} className="manage-players-btn">
            ⚙️ Manage My Players
          </button>
        </div>
      </div>

      {dashboardStats.totalPlayers === 0 ? (
        <div className="no-players">
          <div className="no-players-icon">⚽</div>
          <h2>No Players Yet!</h2>
          <p>Your squad is empty. Time to build your dream team!</p>
          <p>Visit the marketplace to discover and purchase talented players.</p>
          <div className="no-players-actions">
            <button onClick={navigateToMarketplace} className="marketplace-button">
              🏪 Browse Marketplace
            </button>
            <button onClick={navigateToManagePlayers} className="manage-button">
              ⚙️ Manage Players
            </button>
            <button onClick={handleRetry} className="refresh-button">
              🔄 Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-items">
          {playersDashboard.map((player) => (
            <FifaPlayerCard
              key={player.id}
              player={player}
              clubName={userInfo.teamName || userInfo.clubName || userInfo.username || 'Unknown Club'}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;