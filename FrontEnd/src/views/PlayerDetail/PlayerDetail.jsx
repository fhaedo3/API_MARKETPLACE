import './PlayerDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayerById } from '../../store/slices/playerSlice';
import { fetchCartItems, addToCart } from '../../store/slices/cartSlice';
import { fetchUserByUsername } from '../../store/slices/clubSlice';

const PlayerDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Redux state
  const { token, user: authUser, isAuthenticated } = useSelector(state => state.auth);
  const { currentPlayer, loading, error } = useSelector(state => state.players);
  const { items: cartItems, cartId, userId: cartUserId } = useSelector(state => state.cart);

  // Local state
  const [isInCart, setIsInCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isOwnPlayer, setIsOwnPlayer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Función para mostrar toast
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 2500);
  };

  // Función para decodificar token y obtener username
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

  // Función para obtener el userId real del usuario logueado
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

  // Función para agregar al carrito usando Redux
  const handleAddToCart = async () => {
    if (!isAuthenticated || !token) {
      showToastMessage('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    if (isInCart) {
      showToastMessage('Player already in cart!');
      return;
    }

    if (isOwnPlayer) {
      showToastMessage('Cannot add your own player to cart');
      return;
    }

    if (!currentPlayer.isForSale) {
      showToastMessage('This player is not for sale');
      return;
    }

    try {
      // Primero asegurarse de que tenemos el carrito actualizado
      await dispatch(fetchCartItems()).unwrap();

      // Luego agregar el item
      await dispatch(addToCart({
        userId: cartUserId,
        playerId: currentPlayer.id
      })).unwrap();

      // Actualizar el carrito después de agregar
      await dispatch(fetchCartItems()).unwrap();

      setIsInCart(true);
      showToastMessage('Player added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToastMessage('Error adding player to cart: ' + error);
    }
  };

  // Verificar si el jugador está en el carrito
  useEffect(() => {
    if (currentPlayer && cartItems.length > 0) {
      const playerInCart = cartItems.some(item => item.id === currentPlayer.id);
      setIsInCart(playerInCart);
    }
  }, [currentPlayer, cartItems]);

  // Verificar si es el propio jugador
  useEffect(() => {
    const checkOwnPlayer = async () => {
      if (currentPlayer && currentPlayer.ownerId && isAuthenticated) {
        const userId = await getCurrentUserId();
        if (userId) {
          setCurrentUserId(userId);
          setIsOwnPlayer(currentPlayer.ownerId === userId);
        }
      }
    };

    checkOwnPlayer();
  }, [currentPlayer, isAuthenticated, token]);

  // Fetch inicial de datos
  useEffect(() => {
    if (id) {
      dispatch(fetchPlayerById(id));
    }

    // Fetch cart items if authenticated
    if (isAuthenticated && token) {
      dispatch(fetchCartItems());
    }
  }, [id, dispatch, isAuthenticated, token]);

  if (loading) {
    return (
      <div className="player-detail">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-detail">
        <h2>Error: {error}</h2>
        <button onClick={() => dispatch(fetchPlayerById(id))}>
          Retry
        </button>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="player-detail">
        <h2>Player not found</h2>
        <button onClick={() => navigate('/players')}>
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <>
      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      <div className="player-detail">
        <div className="player-header">
          <img
            src={currentPlayer.image || 'https://via.placeholder.com/120'}
            alt={currentPlayer.name || 'Player'}
            className="player-image"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/120')}
          />
          <h1 className="player-bio">
            {currentPlayer.name && currentPlayer.lastName
              ? `${currentPlayer.name} ${currentPlayer.lastName}`
              : currentPlayer.name || 'Unknown Player'}
          </h1>
        </div>

        <div className="player-bio">
          <p><strong>Position:</strong> {currentPlayer.position || 'N/A'}</p>
          <p><strong>Rating:</strong> {currentPlayer.rating || 'N/A'}</p>
          <p><strong>Price:</strong> ${currentPlayer.price?.toLocaleString() || 'N/A'}</p>
          <p><strong>Club:</strong> {currentPlayer.clubName || 'Unknown Club'}</p>
          <p><strong>Owner:</strong> {currentPlayer.ownerName || '-'}</p>
          <p>
            <strong>Status:</strong> {currentPlayer.isForSale ? (
              <span className="for-sale-label">FOR SALE</span>
            ) : (
              <span className="not-for-sale-label">NOT FOR SALE</span>
            )}
          </p>
        </div>

        <div className="player-info">
          <p><strong>Characteristics:</strong></p>
          <ul>
            {currentPlayer.characteristics && currentPlayer.characteristics.length > 0
              ? currentPlayer.characteristics.map((charac, idx) => (
                <li key={idx}>{charac}</li>
              ))
              : <li>No characteristics available</li>
            }
          </ul>
        </div>

        <div className="player-actions-detail">
          {currentPlayer.isForSale ? (
            <button
              className="buy-button"
              onClick={handleAddToCart}
              disabled={isInCart || isOwnPlayer || !isAuthenticated}
            >
              {!isAuthenticated
                ? 'Login to Add to Cart'
                : isOwnPlayer
                  ? 'Player Already in the Club'
                  : isInCart
                    ? 'In Cart ✓'
                    : 'Add to Cart'
              }
            </button>
          ) : (
            <div className="not-for-sale-banner">
              This player is not for sale
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerDetail;