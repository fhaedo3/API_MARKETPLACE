import './PlayerDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Función para obtener el userId del token
  // Función para obtener el userId real consultando la API por username
  const getUserIdFromToken = async (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      const username = decoded.sub || decoded.username || decoded.name;
      if (!username) return null;
      // Llama a la API de users para obtener el id real
      const usersResp = await fetch('http://localhost:8080/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!usersResp.ok) return null;
      const users = await usersResp.json();
      const user = users.find(u => u.username === username);
      return user ? user.id : null;
    } catch {
      return null;
    }
  };

  // Función para verificar si el jugador está en el carrito
  const checkPlayerInCart = async (playerId, token) => {
    try {
      const userId = await getUserIdFromToken(token);
      if (!userId) return false;
      const cartResponse = await fetch(`http://localhost:8080/shopping-carts/user/${userId}/active`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (cartResponse.status === 404) return false;
      const cart = await cartResponse.json();
      const cartItemsResponse = await fetch(`http://localhost:8080/cart-items/cart/${cart.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!cartItemsResponse.ok) return false;
      const cartItems = await cartItemsResponse.json();
      return cartItems.some(item => item.playerId === parseInt(playerId));
    } catch (error) {
      console.error('Error checking cart:', error);
      return false;
    }
  };

  // Función para agregar al carrito
  const handleAddToCart = async () => {
    if (isInCart) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart');
        return;
      }
      const response = await fetch('http://localhost:8080/cart-items/add-to-cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          cartId: 'active', // Simplificado, asumiendo que la API maneja el carrito activo
          playerId: player.id,
          quantity: 1,
        }),
      });
      if (!response.ok) throw new Error('Error adding to cart');
      setIsInCart(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding player to cart');
    }
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
        if (!response.ok) throw new Error('Error fetching player');
        const data = await response.json();
        data.characteristics = data.characteristics
          ? Array.isArray(data.characteristics)
            ? data.characteristics
            : data.characteristics.split(',').map(c => c.trim())
          : [];
        setPlayer(data);
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

  if (loading) return <div className="player-detail"><h2>Loading...</h2></div>;
  if (error) return <div className="player-detail"><h2>Error: {error}</h2></div>;
  if (!player) return <div className="player-detail"><h2>Player not found</h2></div>;

  return (
    <>
      {showToast && (
        <div className="toast">
          {isInCart ? 'Player already in cart!' : 'Player added to cart!'}
        </div>
      )}
      <div className="player-detail">
        <div className="player-header">
          <img
            src={player.image || 'https://via.placeholder.com/120'}
            alt={player.name || 'Player'}
            className="player-image"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/120')}
          />
          <h1 className="player-name">
            {player.name && player.lastName ? `${player.name} ${player.lastName}` : player.name || 'Unknown Player'}
          </h1>
        </div>
        <div className="player-bio">
          <p><strong>Position:</strong> {player.position || 'N/A'}</p>
          <p><strong>Rating:</strong> {player.rating || 'N/A'}</p>
          <p><strong>Price:</strong> ${player.price?.toLocaleString() || 'N/A'}</p>
          <p><strong>Club:</strong> {player.clubName || 'Unknown Club'}</p>
          <p><strong>Owner:</strong> {player.ownerName || '-'}</p>
          <p>
            <strong>Status:</strong> {player.isForSale ? (
              <span className="for-sale-label">FOR SALE</span>
            ) : (
              <span className="not-for-sale-label">NOT FOR SALE</span>
            )}
          </p>
        </div>
        <div className="player-info">
          <p><strong>Characteristics:</strong></p>
          <ul>
            {player.characteristics && player.characteristics.length > 0
              ? player.characteristics.map((charac, idx) => <li key={idx}>{charac}</li>)
              : <li>No characteristics available</li>
            }
          </ul>
        </div>
        <div className="player-actions">
          {player.isForSale ? (
            <button
              className="buy-button"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? 'In Cart ✓' : 'Add to Cart'}
            </button>
          ) : (
            <div className="not-for-sale-banner">This player is not for sale</div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerDetail;