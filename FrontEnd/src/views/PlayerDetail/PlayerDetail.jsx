import './PlayerDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayerById } from '../../store/slices/playerSlice';
import { fetchCartItems, addToCart } from '../../store/slices/cartSlice';
import { getCurrentUserId } from '../../store/slices/authSlice';
import { getPlayerImageUrl, handleImageError } from '../../utils/imageUtils';

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
      // Obtener el userId real del usuario logueado usando Redux
      const realUserId = await dispatch(getCurrentUserId()).unwrap();
      
      if (!realUserId) {
        showToastMessage('Error getting user ID. Please login again.');
        return;
      }

      console.log('Adding to cart with userId:', realUserId, 'playerId:', currentPlayer.id);

      // Primero asegurarse de que tenemos el carrito actualizado
      await dispatch(fetchCartItems()).unwrap();

      // Luego agregar el item
      await dispatch(addToCart({
        userId: realUserId,
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
        try {
          const userId = await dispatch(getCurrentUserId()).unwrap();
          if (userId) {
            setCurrentUserId(userId);
            setIsOwnPlayer(currentPlayer.ownerId === userId);
          }
        } catch (error) {
          console.error('Error checking own player:', error);
        }
      }
    };

    checkOwnPlayer();
  }, [currentPlayer, isAuthenticated, token, dispatch]);

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
          {/* Debug player data */}
          {console.log('PlayerDetail Debug:', {
            playerName: currentPlayer.name,
            playerId: currentPlayer.id,
            playerImage: currentPlayer.image,
            computedImageUrl: getPlayerImageUrl(currentPlayer),
            fullPlayer: currentPlayer
          })}
          <img
            src={getPlayerImageUrl(currentPlayer)}
            alt={currentPlayer.name || 'Player'}
            className="player-image"
            onError={(e) => handleImageError(e, currentPlayer.id)}
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