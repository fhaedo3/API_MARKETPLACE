/**
 * Utilidades para manejar las imágenes de jugadores
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Genera la URL correcta para la imagen de un jugador
 * @param {Object} player - El objeto jugador
 * @returns {string} - La URL de la imagen
 */
export const getPlayerImageUrl = (player) => {
  console.log('🖼️ getPlayerImageUrl called with:', player);
  
  if (!player) {
    console.log('🖼️ No player provided, returning default image');
    return '/images/default-player.png';
  }

  // Si el jugador tiene una imagen personalizada almacenada en el backend
  if (player.image && player.image.startsWith('/images/players/')) {
    console.log('🖼️ Using backend stored image:', player.image);
    const imagePath = player.image.replace('/images/players/', '');
    const [playerId, fileName] = imagePath.split('/');
    return `${API_BASE_URL}/players/image/${playerId}/${fileName}`;
  }

  // Si la imagen es una URL externa (como las de placeholder)
  if (player.image && (player.image.startsWith('http') || player.image.startsWith('https'))) {
    console.log('🖼️ Using external URL:', player.image);
    return player.image;
  }

  // Si la imagen es una ruta local del frontend
  if (player.image && player.image.startsWith('/images/')) {
    console.log('🖼️ Using local frontend image:', player.image);
    return player.image;
  }

  // Fallback determinístico basado en el ID del jugador
  if (player.id) {
    console.log('🖼️ No valid image found, using deterministic placeholder for player', player.id);
    return getPlaceholderImageUrl(player.id);
  }

  // Imagen por defecto como último recurso
  console.log('🖼️ No valid image or ID found, using default');
  return '/images/default-player.png';
};

/**
 * Genera una imagen placeholder basada en el ID del jugador
 * @param {number} playerId - ID del jugador
 * @returns {string} - URL de la imagen placeholder
 */
export const getPlaceholderImageUrl = (playerId) => {
  // Usar una imagen de placeholder basada en el ID (0-99 para ser consistente)
  const placeholderIndex = playerId % 100;
  return `https://randomuser.me/api/portraits/men/${placeholderIndex}.jpg`;
};

/**
 * Maneja errores de carga de imagen
 * @param {Event} event - Evento de error de imagen
 * @param {number} playerId - ID del jugador (opcional)
 */
export const handleImageError = (event, playerId = null) => {
  const img = event.target;
  
  // Si ya intentamos el placeholder, usar imagen por defecto
  if (img.src.includes('randomuser.me') || img.src.includes('default-player.png')) {
    img.src = '/images/default-player.png';
    return;
  }

  // Intentar con placeholder si tenemos el ID del jugador
  if (playerId) {
    img.src = getPlaceholderImageUrl(playerId);
  } else {
    img.src = '/images/default-player.png';
  }
};
