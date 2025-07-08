// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/v1/auth/authenticate',
      REGISTER: '/api/v1/auth/register',
    },
    // Player endpoints
    PLAYERS: {
      PUBLIC: '/players/public',
      BY_ID: '/players',
      BY_OWNER: '/players/owner',
    },
    // Cart endpoints
    CART: {
      ACTIVE: '/shopping-carts/user',
      CLEAR: '/shopping-carts/user',
    },
    // Cart items endpoints
    CART_ITEMS: {
      ADD: '/cart-items/add-to-cart',
      REMOVE: '/cart-items/remove-from-cart',
    },
    // User endpoints
    USERS: {
      PROFILE: '/users',
      BALANCE: '/users',
      LIST: '/users',
    },
    // Transaction endpoints
    TRANSACTIONS: {
      CREATE_TRANSFER: '/transactions/create-transfer',
    },
  },
};

// Helper function to build complete URLs
export const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Replace URL parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Helper function to build URLs with query parameters
export const buildUrlWithQuery = (endpoint, queryParams = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, queryParams[key]);
    }
  });
  
  return url.toString();
};

export default API_CONFIG;
