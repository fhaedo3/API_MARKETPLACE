import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlayerImageUrl, handleImageError } from '../../utils/imageUtils';
import './ManageMyPlayers.css';

const ManageMyPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Separar estados para diferentes tipos de edición
    const [editingPlayerData, setEditingPlayerData] = useState(null); // Para editar datos completos
    const [editingPlayerPrice, setEditingPlayerPrice] = useState(null); // Para editar solo precio
    const [newPrice, setNewPrice] = useState('');
    const [playerToSell, setPlayerToSell] = useState(null);
    
    // Estado para toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const navigate = useNavigate();

    // Función para mostrar toast
    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    // Funciones de utilidad
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
                    return [];
                }
                throw new Error(`Error fetching players: ${response.status}`);
            }
            const players = await response.json();
            return players || [];
        } catch (error) {
            console.error('Error fetching user players:', error);
            throw error;
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found.');
                    return;
                }

                const decodedToken = decodeToken(token);
                if (!decodedToken || !decodedToken.sub) {
                    setError('Invalid authentication token.');
                    return;
                }

                const userInfo = await getUserByUsername(decodedToken.sub, token);
                setUserInfo(userInfo);

                const allPlayers = await fetchUserPlayers(userInfo.id, token);
                // Filtrar para mostrar solo jugadores que NO están en venta (están en el club)
                //const playersInClub = allPlayers.filter(player => !player.isForSale);
                setPlayers(allPlayers);
            } catch (error) {
                console.error('Error loading data:', error);
                setError(error.message);
            } finally { 
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Cambiar estado de venta
    const togglePlayerSale = async (playerId, currentSaleStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newSaleStatus = !currentSaleStatus;

            const response = await fetch(`http://localhost:8080/players/${playerId}/forsale/${newSaleStatus}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error updating sale status');
            }

            const updatedPlayer = await response.json();
            
            // Actualizar el jugador en la lista local
            setPlayers(prev => prev.map(p => p.id === playerId ? updatedPlayer : p));
            
            // Mostrar mensaje de éxito
            const message = newSaleStatus 
                ? 'Jugador puesto en venta exitosamente'
                : 'Jugador retirado de venta exitosamente';
            showToastMessage(message);

            setPlayerToSell(null);
        } catch (error) {
            console.error('Error updating sale status:', error);
            showToastMessage('Error al actualizar estado de venta. Inténtalo de nuevo.');
        }
    };

    // Actualizar precio
    const updatePrice = async (playerId) => {
        try {
            const price = parseFloat(newPrice);
            if (isNaN(price) || price <= 0) {
                showToastMessage('Por favor ingresa un precio válido mayor a 0');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/players/${playerId}/price/${price}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error updating price');
            }

            const updatedPlayer = await response.json();
            setPlayers(prev => prev.map(p => p.id === playerId ? updatedPlayer : p));
            setEditingPlayerPrice(null);
            setNewPrice('');
            showToastMessage('Precio modificado exitosamente');
        } catch (error) {
            console.error('Error updating price:', error);
            showToastMessage('Error al actualizar precio. Inténtalo de nuevo.');
        }
    };

    // Actualizar jugador completo
    const updatePlayer = async (playerId, playerData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/players/${playerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            });

            if (!response.ok) {
                throw new Error('Error updating player');
            }

            const updatedPlayer = await response.json();
            setPlayers(prev => prev.map(p => p.id === playerId ? updatedPlayer : p));
            setEditingPlayerData(null);
            showToastMessage('Jugador actualizado exitosamente');
        } catch (error) {
            console.error('Error updating player:', error);
            showToastMessage('Error al actualizar jugador. Inténtalo de nuevo.');
        }
    };

    if (loading) {
        return (
            <div className="manage-players-container">
                <div className="loading">Loading your players...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manage-players-container">
                <div className="error">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="back-button">
                        Back to My Team
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-players-container">
            <header className="manage-header">
                <h1>Manage My Players</h1>
                <div className="header-actions">
                    <button
                        className="add-player-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add New Player
                    </button>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to My Team
                    </button>
                </div>
            </header>

            {players.length === 0 ? (
                <div className="no-players">
                    <h2>No Players in Club</h2>
                    <p>All your players might be for sale, or you haven't added any players yet.</p>
                    <p>Start building your team by adding your first player!</p>
                    <button
                        className="add-first-player-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        Add Your First Player
                    </button>
                </div>
            ) : (
                <div className="players-grid">
                    {players.map(player => (
                        <div key={player.id} className="player-card-manage">
                            <div className="player-image-container">
                                <img
                                    src={getPlayerImageUrl(player)}
                                    alt={player.name}
                                    className="player-image"
                                    onError={(e) => handleImageError(e, player.id)}
                                />
                                <div className={`sale-status ${player.isForSale ? 'for-sale' : 'not-for-sale'}`}>
                                    {player.isForSale ? 'FOR SALE' : 'NOT FOR SALE'}
                                </div>
                            </div>

                            <div className="player-info">
                                <h3 className="player-name">{player.name}</h3>
                                <p className="player-position">{player.position}</p>
                                <p className="player-rating">Rating: {player.rating}</p>

                                <div className="price-section">
                                    {editingPlayerPrice === player.id ? (
                                        <div className="price-edit">
                                            <input
                                                type="number"
                                                value={newPrice}
                                                onChange={(e) => setNewPrice(e.target.value)}
                                                placeholder="New price"
                                                className="price-input"
                                                min="0"
                                                step="0.01"
                                            />
                                            <div className="price-actions">
                                                <button
                                                    onClick={() => updatePrice(player.id)}
                                                    className="save-btn"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingPlayerPrice(null);
                                                        setNewPrice('');
                                                    }}
                                                    className="cancel-btn"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="price-display">
                                            <span className="price">${player.price?.toLocaleString() || '0'}</span>
                                            <button
                                                onClick={() => {
                                                    setEditingPlayerPrice(player.id);
                                                    setNewPrice(player.price?.toString() || '');
                                                }}
                                                className="edit-price-btn"
                                            >
                                                Edit Price
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="player-actions">
                                <button
                                    onClick={() => setEditingPlayerData(player)}
                                    className="action-btn edit-player-btn"
                                    title="Edit player details"
                                >
                                    <span className="btn-icon">✏️</span>
                                    <span className="btn-text">Edit</span>
                                </button>

                                {!player.isForSale ? (
                                    <button
                                        onClick={() => setPlayerToSell(player)}
                                        className="action-btn toggle-sale-btn put-for-sale"
                                        title="Put on marketplace"
                                    >
                                        <span className="btn-icon">💰</span>
                                        <span className="btn-text">Put for Sale</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setPlayerToSell(player)}
                                        className="action-btn toggle-sale-btn remove-from-sale"
                                        title="Remove from marketplace"
                                    >
                                        <span className="btn-icon">🏠</span>
                                        <span className="btn-text">Remove from Sale</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmación para cambiar estado de venta */}
            {playerToSell && (
                <div className="modal-overlay" onClick={() => setPlayerToSell(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="sale-warning">
                            <div className="sale-warning-icon">{playerToSell.isForSale ? '🏠' : '💰'}</div>
                            <h2>{playerToSell.isForSale ? 'Remove Player from Sale' : 'Put Player for Sale'}</h2>
                            <p>
                                Are you sure you want to {playerToSell.isForSale ? 'remove' : 'put'} <strong>{playerToSell.name}</strong> {playerToSell.isForSale ? 'from sale' : 'for sale'}?
                            </p>
                            {!playerToSell.isForSale ? (
                                <p>
                                    The player will be moved to the marketplace and other users will be able to purchase them.
                                </p>
                            ) : (
                                <p>
                                    The player will be removed from the marketplace and returned to your squad.
                                </p>
                            )}
                            <p>Current price: <strong>${playerToSell.price?.toLocaleString() || '0'}</strong></p>
                        </div>
                        <div className="form-actions">
                            <button
                                onClick={() => togglePlayerSale(playerToSell.id, playerToSell.isForSale)}
                                className="confirm-sale-btn"
                            >
                                {playerToSell.isForSale ? 'Yes, Remove from Sale' : 'Yes, Put for Sale'}
                            </button>
                            <button
                                onClick={() => setPlayerToSell(null)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para agregar jugador */}
            {showAddForm && (
                <AddPlayerModal
                    userInfo={userInfo}
                    onClose={() => setShowAddForm(false)}
                    showToastMessage={showToastMessage}
                    onPlayerAdded={(newPlayer) => {
                        // Solo agregar a la lista si NO está marcado para venta
                        if (!newPlayer.isForSale) {
                            setPlayers(prev => [...prev, newPlayer]);
                        }
                        setShowAddForm(false);

                        const message = newPlayer.isForSale
                            ? 'Jugador creado y puesto en venta en el mercado!'
                            : 'Jugador creado y agregado a tu club!';
                        showToastMessage(message);
                    }}
                />
            )}

            {/* Modal para editar jugador */}
            {editingPlayerData && (
                <EditPlayerModal
                    player={editingPlayerData}
                    onClose={() => setEditingPlayerData(null)}
                    onPlayerUpdated={updatePlayer}
                />
            )}

            {/* Toast para mostrar mensajes */}
            {showToast && (
                <div 
                    className="toast-message" 
                    onClick={() => setShowToast(false)}
                >
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

// Componente modal para agregar jugador
const AddPlayerModal = ({ userInfo, onClose, onPlayerAdded, showToastMessage }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        position: '',
        rating: '',
        characteristics: '',
        price: '',
        isForSale: false
    });
    const [loading, setLoading] = useState(false);

    const positions = [
        'Goalkeeper',
        'Center-Back',
        'Left-Back',
        'Right-Back',
        'Defensive Midfielder',
        'Central Midfielder',
        'Attacking Midfielder',
        'Left Midfielder',
        'Right Midfielder',
        'Left Winger',
        'Right Winger',
        'Striker',
        'Center Forward'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            // Combinar firstName y lastName en un solo name
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            
            // Generar número aleatorio para la imagen (0-99)
            const randomImageNumber = Math.floor(Math.random() * 100);
            const imageUrl = `https://randomuser.me/api/portraits/men/${randomImageNumber}.jpg`;

            // Crear el objeto player usando FormData como antes
            const formDataToSend = new FormData();
            
            const playerData = {
                name: fullName,
                position: formData.position,
                rating: parseInt(formData.rating),
                characteristics: formData.characteristics,
                price: parseFloat(formData.price),
                isForSale: formData.isForSale,
                ownerId: userInfo.id
            };

            formDataToSend.append('player', new Blob([JSON.stringify(playerData)], {
                type: 'application/json'
            }));

            console.log('Sending player data:', playerData);
            console.log('Token available:', !!token);

            const response = await fetch('http://localhost:8080/players', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
                throw new Error(`Error creating player: ${response.status} - ${errorText}`);
            }

            const newPlayer = await response.json();
            
            // Agregar la URL de imagen al jugador después de crearlo
            if (newPlayer && !newPlayer.image) {
                newPlayer.image = imageUrl;
            }
            
            onPlayerAdded(newPlayer);
        } catch (error) {
            console.error('Error creating player:', error);
            showToastMessage('Error al crear jugador. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Player</h2>
                <form onSubmit={handleSubmit} className="add-player-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder="Roberto"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                maxLength={50}
                                placeholder="Carlos"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Position:</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                required
                            >
                                <option value="">Select Position</option>
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Overall Rating (1-100):</label>
                            <input
                                type="number"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                required
                                min={1}
                                max={100}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Characteristics:</label>
                        <textarea
                            value={formData.characteristics}
                            onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                            placeholder="Enter characteristics separated by commas"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price ($):</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            min={0}
                            step={0.01}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isForSale}
                                onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                            />
                            Put for sale immediately (player will be moved to marketplace)
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Creating...' : 'Create Player'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente modal para editar jugador
const EditPlayerModal = ({ player, onClose, onPlayerUpdated }) => {
    const [formData, setFormData] = useState({
        name: player.name || '',
        position: player.position || '',
        rating: player.rating || '',
        pace: player.pace || '',
        shooting: player.shooting || '',
        passing: player.passing || '',
        dribbling: player.dribbling || '',
        defending: player.defending || '',
        physical: player.physical || '',
        characteristics: player.characteristics || ''
    });
    const [loading, setLoading] = useState(false);
    
    // Estado para toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    // Función para mostrar toast
    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    const positions = [
        'Goalkeeper',
        'Center-Back',
        'Left-Back',
        'Right-Back',
        'Defensive Midfielder',
        'Central Midfielder',
        'Attacking Midfielder',
        'Left Midfielder',
        'Right Midfielder',
        'Left Winger',
        'Right Winger',
        'Striker',
        'Center Forward'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones básicas
            if (formData.rating < 1 || formData.rating > 100) {
                showToastMessage('El rating debe estar entre 1 y 100');
                setLoading(false);
                return;
            }

            const updatedData = {
                name: formData.name,
                position: formData.position,
                rating: parseInt(formData.rating),
                pace: formData.pace ? parseInt(formData.pace) : null,
                shooting: formData.shooting ? parseInt(formData.shooting) : null,
                passing: formData.passing ? parseInt(formData.passing) : null,
                dribbling: formData.dribbling ? parseInt(formData.dribbling) : null,
                defending: formData.defending ? parseInt(formData.defending) : null,
                physical: formData.physical ? parseInt(formData.physical) : null,
                characteristics: formData.characteristics
            };

            await onPlayerUpdated(player.id, updatedData);
            showToastMessage('Jugador actualizado exitosamente');
        } catch (error) {
            console.error('Error updating player:', error);
            showToastMessage('Error actualizando jugador. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Player: {player.name}</h2>
                <form onSubmit={handleSubmit} className="edit-player-form">
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            minLength={2}
                            maxLength={100}
                            placeholder="Enter full name (e.g., Roberto Carlos)"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Position:</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                required
                            >
                                <option value="">Select Position</option>
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Overall Rating (1-100):</label>
                            <input
                                type="number"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                required
                                min={1}
                                max={100}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Characteristics:</label>
                        <textarea
                            value={formData.characteristics}
                            onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                            placeholder="Enter characteristics separated by commas"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Updating...' : 'Update Player'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
                
                {/* Toast para mostrar mensajes en el modal */}
                {showToast && (
                    <div 
                        className="toast-message modal-toast" 
                        onClick={() => setShowToast(false)}
                    >
                        {toastMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMyPlayers;
