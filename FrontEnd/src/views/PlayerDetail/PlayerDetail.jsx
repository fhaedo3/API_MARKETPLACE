import './PlayerDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Función para verificar si el jugador ya está en el carrito
  const checkPlayerInCart = async (playerId, token) => {
    try {
      // Obtener información del usuario
      const decodedToken = decodeToken(token);
      const usersResponse = await fetch('http://localhost:8080/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const users = await usersResponse.json();
      const user = users.find(u => u.username === decodedToken.sub);

      if (!user) return false;

      // Obtener carrito activo
      const cartResponse = await fetch(`http://localhost:8080/shopping-carts/user/${user.id}/active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (cartResponse.status === 404) {
        return false; // No hay carrito activo
      }

      const cart = await cartResponse.json();

      // Verificar si el jugador está en el carrito
      const cartItemsResponse = await fetch(`http://localhost:8080/cart-items/cart/${cart.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!cartItemsResponse.ok) {
        return false;
      }

      const cartItems = await cartItemsResponse.json();
      return cartItems.some(item => item.playerId === parseInt(playerId));

    } catch (error) {
      console.error('Error checking if player is in cart:', error);
      return false;
    }
  };

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

  // Función para agregar jugador al carrito
  const handleAddToCart = async () => {
    if (isInCart) {
      alert('This player is already in your cart!');
      return;
    }

    setAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart');
        return;
      }

      // Verificar nuevamente antes de agregar
      const alreadyInCart = await checkPlayerInCart(player.id, token);
      if (alreadyInCart) {
        alert('This player is already in your cart!');
        setIsInCart(true);
        return;
      }

      // Decodificar token para obtener usuario
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        alert('Invalid session. Please log in again.');
        return;
      }

      // Obtener información del usuario
      const usersResponse = await fetch('http://localhost:8080/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!usersResponse.ok) {
        throw new Error('Error fetching user information');
      }

      const users = await usersResponse.json();
      const user = users.find(u => u.username === decodedToken.sub);

      if (!user) {
        throw new Error('User not found');
      }

      // Verificar que el jugador esté disponible para la venta
      if (!player.isForSale) {
        alert('This player is not available for sale!');
        return;
      }

      // Obtener o crear carrito activo
      let cartResponse = await fetch(`http://localhost:8080/shopping-carts/user/${user.id}/active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let cart;
      if (cartResponse.status === 404) {
        // Crear nuevo carrito
        const newCartResponse = await fetch('http://localhost:8080/shopping-carts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, status: 'ACTIVE' }),
        });

        if (!newCartResponse.ok) {
          throw new Error('Error creating cart');
        }

        cart = await newCartResponse.json();
      } else if (cartResponse.ok) {
        cart = await cartResponse.json();
      } else {
        throw new Error('Error fetching or creating cart');
      }

      // Agregar jugador al carrito
      const addResponse = await fetch('http://localhost:8080/cart-items/add-to-cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          cartId: cart.id,
          playerId: player.id,
          quantity: 1
        }),
      });

      if (addResponse.status === 409) {
        alert('This player is already in your cart!');
        setIsInCart(true);
        return;
      }

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        throw new Error(`Error adding to cart: ${errorText}`);
      }

      setAddedToCart(true);
      setIsInCart(true);

      // Restablecer el estado visual después de 3 segundos
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`Error adding player to cart: ${error.message}. Please try again.`);
    } finally {
      setAddingToCart(false);
    }
  };

  // Obtener el userId logueado
  const getLoggedUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded && decoded.userId ? decoded.userId : null;
  };

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
          throw new Error(`Error fetching player details: ${response.status}`);
        }

        const data = await response.json();

        // Parse characteristics if needed
        data.characteristics = data.characteristics
          ? (Array.isArray(data.characteristics)
            ? data.characteristics
            : data.characteristics.split(',').map(c => c.trim()))
          : [];

        setPlayer(data);

        // Verificar si el jugador ya está en el carrito
        if (token) {
          const inCart = await checkPlayerInCart(id, token);
          setIsInCart(inCart);
        }

      } catch (err) {
        console.error('Error fetching player:', err);
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

  // Lógica para saber si el jugador pertenece al usuario logueado
  const loggedUserId = getLoggedUserId();
  const isOwnPlayer = loggedUserId && (player.ownerId === loggedUserId || player.owner?.id === loggedUserId);

  return (
    <div className="player-detail">
      <div className="player-header">
        <img src={player.image || '/images/default-player.png'} alt={player.name} className="player-image" />
        <h1 className="player-name">{player.name}</h1>
      </div>
      <div className="player-bio">
        <p><strong>Position:</strong> {player.position}</p>
        <p><strong>Rating:</strong> {player.rating}</p>
        <p><strong>Price:</strong> ${player.price?.toLocaleString() || 'N/A'}</p>
        <p><strong>Status:</strong> {player.isForSale ? 'FOR SALE' : 'NOT FOR SALE'}</p>
      </div>
      <div className="player-info">
        <p><strong>Characteristics:</strong></p>
        <ul>
          {player.characteristics && player.characteristics.length > 0
            ? player.characteristics.map((charac, idx) => (
              <li key={idx}>{charac}</li>
            ))
            : <li>No characteristics available</li>
          }
        </ul>
      </div>
      <div className="player-actions">
        {player.isForSale && !isOwnPlayer && (
          <button
            className={`buy-button ${addedToCart ? 'added' : ''} ${isInCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart || isInCart}
            title={isInCart ? 'Already in cart' : 'Add to cart'}
          >
            {addingToCart
              ? 'Adding...'
              : isInCart
                ? 'In Cart ✓'
                : addedToCart
                  ? 'Added ✓'
                  : 'Add to Cart'
            }
          </button>
        )}
        {isOwnPlayer && (
          <p style={{ color: '#ccc', fontStyle: 'italic' }}>You cannot buy your own player</p>
        )}
        {!player.isForSale && !isOwnPlayer && (
          <p style={{ color: '#ccc', fontStyle: 'italic' }}>This player is not available for purchase</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDetail;
