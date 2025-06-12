// src/views/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import './Cart.css';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  // Función para decodificar el JWT
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
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  // Función para obtener o crear el carrito activo del usuario
  const getActiveCart = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/shopping-carts/user/${userId}/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // Crear un nuevo carrito si no existe
        return await createNewCart(userId, token);
      } else {
        throw new Error(`Error fetching active cart: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching active cart:', error);
      throw error;
    }
  };

  // Función para crear un nuevo carrito
  const createNewCart = async (userId, token) => {
    try {
      const response = await fetch('http://localhost:8080/shopping-carts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          status: 'ACTIVE'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating cart: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };

  // Función para obtener los items del carrito
  const getCartItems = async (cartId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/cart-items/cart/${cartId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Error fetching cart items: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };

  // Función para obtener detalles de los jugadores
  const getPlayerDetails = async (playerId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/players/${playerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching player ${playerId}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching player details:', error);
      return null;
    }
  };

  // Función para eliminar un jugador del carrito
  const removePlayerFromCart = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !cartId) return;

      const response = await fetch(`http://localhost:8080/cart-items/remove-from-cart?cartId=${cartId}&playerId=${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error removing player from cart: ${response.status}`);
      }

      // Actualizar la lista local
      setCartItems(prev => prev.filter(item => item.id !== playerId));
    } catch (error) {
      console.error('Error removing player from cart:', error);
      setError('Error removing player from cart');
    }
  };

  // Función para realizar la compra
  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validar que todos los jugadores estén disponibles para la venta
    const unavailablePlayers = cartItems.filter(player => !player.isForSale);
    if (unavailablePlayers.length > 0) {
      alert(`Some players in your cart are no longer available for sale: ${unavailablePlayers.map(p => p.name).join(', ')}`);
      return;
    }

    // Confirmar compra
    const totalAmount = cartItems.reduce((acc, player) => acc + (player.price || 0), 0);
    if (!window.confirm(`Are you sure you want to buy ${cartItems.length} player(s) for $${totalAmount.toLocaleString()}?`)) {
      return;
    }

    try {
      setPurchasing(true);
      const token = localStorage.getItem('token');
      if (!token || !cartId) return;

      // Crear transacciones para cada jugador
      const transactionPromises = cartItems.map(async (player) => {
        const response = await fetch(`http://localhost:8080/transactions/create-transfer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            buyerId: userInfo.id,
            sellerId: player.owner?.id || 1, // Si no tiene owner, asumimos ID 1
            playerId: player.id,
            total: player.price
          }),
        });

        if (!response.ok) {
          throw new Error(`Error creating transaction for player ${player.name}: ${response.status}`);
        }

        return response.json();
      });

      // Esperar a que todas las transacciones se completen
      await Promise.all(transactionPromises);

      // Realizar checkout del carrito
      const checkoutResponse = await fetch(`http://localhost:8080/shopping-carts/${cartId}/checkout`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!checkoutResponse.ok) {
        throw new Error(`Error during checkout: ${checkoutResponse.status}`);
      }

      alert(`Purchase completed successfully! You bought ${cartItems.length} player(s) for $${totalAmount.toLocaleString()}`);

      // Limpiar el carrito local
      setCartItems([]);

      // Opcional: Recargar el carrito desde el servidor para asegurar sincronización
      await loadCartData();

    } catch (error) {
      console.error('Error during purchase:', error);
      alert(`Error completing purchase: ${error.message}. Please try again.`);
    } finally {
      setPurchasing(false);
    }
  };

  // Función para vaciar el carrito
  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is already empty!');
      return;
    }

    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token || !cartId) return;

      // Eliminar cada item del carrito usando Promise.all para mejor rendimiento
      const deletePromises = cartItems.map(player =>
        fetch(`http://localhost:8080/cart-items/remove-from-cart?cartId=${cartId}&playerId=${player.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(deletePromises);

      // Verificar que todas las eliminaciones fueron exitosas
      const failedRemovals = responses.filter(response => !response.ok);
      if (failedRemovals.length > 0) {
        throw new Error(`Failed to remove ${failedRemovals.length} items from cart`);
      }

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Error clearing cart. Please try again.');
    }
  };

  // Función separada para cargar datos del carrito (reutilizable)
  const loadCartData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid authentication token.');
    }

    // Obtener información del usuario
    const userInfo = await getUserByUsername(decodedToken.sub, token);
    setUserInfo(userInfo);

    // Obtener carrito activo
    const cart = await getActiveCart(userInfo.id, token);
    setCartId(cart.id);

    // Obtener items del carrito
    const cartItemsResponse = await getCartItems(cart.id, token);

    // Eliminar duplicados basados en ID del jugador
    const uniqueCartItems = cartItemsResponse.filter((item, index, self) =>
      index === self.findIndex(i => i.playerId === item.playerId)
    );

    // Obtener detalles completos de cada jugador
    const playersWithDetails = await Promise.all(
      uniqueCartItems.map(async (item) => {
        const playerDetails = await getPlayerDetails(item.playerId, token);
        return playerDetails ? {
          ...playerDetails,
          characteristics: playerDetails.characteristics
            ? (Array.isArray(playerDetails.characteristics)
              ? playerDetails.characteristics
              : playerDetails.characteristics.split(',').map(c => c.trim()))
            : []
        } : null;
      })
    );

    // Filtrar jugadores válidos y eliminar duplicados finales
    const validPlayers = playersWithDetails
      .filter(player => player !== null)
      .filter((player, index, self) =>
        index === self.findIndex(p => p.id === player.id)
      );

    setCartItems(validPlayers);
  };

  // Efecto para cargar el carrito al montar el componente
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError(null);
        await loadCartData();
      } catch (error) {
        console.error('Error loading cart:', error);
        setError(error.message || 'Error loading cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

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
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="containerCart">
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
                  onClick={() => removePlayerFromCart(player.id)}
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
                {purchasing ? 'Processing...' : `Buy (${cartItems.length} player${cartItems.length !== 1 ? 's' : ''})`}
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
