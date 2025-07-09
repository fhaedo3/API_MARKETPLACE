// src/views/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Cart.css';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';
import { fetchCartItems, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import { fetchUserProfile } from '../../store/slices/userSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { token, user: authUser, isAuthenticated } = useSelector(state => state.auth);
  const { 
    items: cartItems, 
    loading, 
    error, 
    cartId,
    totalAmount 
  } = useSelector(state => state.cart);
  const { profile: userInfo } = useSelector(state => state.user);
  
  // Local state
  const [purchasing, setPurchasing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Función para mostrar toast
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);

    // Ocultar toast después de 3 segundos
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000);
  };

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    // Only fetch cart items if user is authenticated
    if (isAuthenticated && token) {
      dispatch(fetchCartItems());
    }

    // Only fetch user profile if not already loaded
    if (!userInfo && isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, token, navigate, dispatch]);

  // Handle remove player from cart
  const handleRemovePlayer = async (playerId) => {
    try {
      // Find player name for toast message
      const playerToRemove = cartItems.find(item => item.id === playerId);
      const playerName = playerToRemove ? playerToRemove.name : 'Player';

      // Dispatch remove action
      await dispatch(removeFromCart(playerId)).unwrap();
      
      // Show success message
      showToastMessage(`¡${playerName} was removed from cart!`);
    } catch (error) {
      console.error('Error removing player from cart:', error);
      showToastMessage('Error removing player from cart');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      showToastMessage('Your cart is already empty!');
      return;
    }

    try {
      const itemCount = cartItems.length;
      await dispatch(clearCart()).unwrap();
      showToastMessage(`¡Cart cleared! ${itemCount} player${itemCount !== 1 ? 's' : ''} removed.`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      showToastMessage('Error clearing cart. Please try again.');
    }
  };

  // Handle purchase navigation
  const handlePurchase = () => {
    console.log('handlePurchase called');
    console.log('Cart state:', { 
      cartItems: cartItems.length, 
      isAuthenticated, 
      token: !!token 
    });

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate that all players are available for sale
    const unavailablePlayers = cartItems.filter(player => !player.isForSale);
    if (unavailablePlayers.length > 0) {
      alert(`Some players in your cart are no longer available for sale: ${unavailablePlayers.map(p => p.name).join(', ')}`);
      return;
    }

    console.log('Navigating to checkout...');
    // Navigate to checkout - Redux state will be available there
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((acc, player) => acc + (player.price || 0), 0);

  if (loading) {
    return (
      <div className="containerCart">
        <div className="cart-loading">
          <h2>Loading your cart...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="containerCart">
        <div className="cart-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => {
            dispatch(fetchCartItems());
            if (!userInfo) {
              dispatch(fetchUserProfile());
            }
          }} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="containerCart">
      {/* Toast notification */}
      {showToast && (
        <div className="negative-toast">
          {toastMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some players to your cart to see them here!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((player) => (
              <div key={`cart-item-${player.id}`} className="cart-item-wrapper">
                <FifaPlayerCard
                  player={player}
                  compact={true}
                  hideSaleBadge={true}
                />
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemovePlayer(player.id)}
                  title="Remove from cart"
                  aria-label={`Remove ${player.name} from cart`}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-subtotal">
              Subtotal: ${subtotal.toLocaleString()}
            </div>
            <div className="left-buttons">
              <button
                className="btn-buy"
                onClick={handlePurchase}
                disabled={purchasing || cartItems.length === 0}
              >
                {purchasing ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button
                className="btn-delete"
                onClick={handleClearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart 🗑️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
