import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to decode JWT token
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

// Helper function to get user by username
const getUserByUsername = async (username, token) => {
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
};

// Helper function to get or create active cart
const getActiveCart = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/shopping-carts/user/${userId}/active`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  } else if (response.status === 404) {
    // Create new cart if it doesn't exist
    const createResponse = await fetch('http://localhost:8080/shopping-carts', {
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
    if (!createResponse.ok) {
      throw new Error(`Error creating cart: ${createResponse.status}`);
    }
    return await createResponse.json();
  } else {
    throw new Error(`Error fetching active cart: ${response.status}`);
  }
};

// Async thunk to fetch complete cart items with player details
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue, getState }) => {
    try {
      // First try to get token from Redux state
      const state = getState();
      let token = state.auth.token;
      
      // If not in Redux, try localStorage
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.sub) {
        return rejectWithValue('Invalid authentication token.');
      }

      // Get user info
      const userInfo = await getUserByUsername(decodedToken.sub, token);
      
      // Get active cart
      const cart = await getActiveCart(userInfo.id, token);
      
      // Get cart items
      const cartItemsResponse = await fetch(`${API_BASE_URL}/cart-items/cart/${cart.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let cartItems = [];
      if (cartItemsResponse.ok) {
        cartItems = await cartItemsResponse.json();
      } else if (cartItemsResponse.status !== 404) {
        throw new Error('Failed to fetch cart items');
      }

      // Remove duplicates based on player ID
      const uniqueCartItems = cartItems.filter((item, index, self) =>
        index === self.findIndex(i => i.playerId === item.playerId)
      );

      // Get complete player details for each cart item
      const playersWithDetails = await Promise.all(
        uniqueCartItems.map(async (item) => {
          const playerResponse = await fetch(`${API_BASE_URL}/players/${item.playerId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (playerResponse.ok) {
            const playerDetails = await playerResponse.json();
            return {
              ...playerDetails,
              characteristics: playerDetails.characteristics
                ? (Array.isArray(playerDetails.characteristics)
                  ? playerDetails.characteristics
                  : playerDetails.characteristics.split(',').map(c => c.trim()))
                : []
            };
          }
          return null;
        })
      );

      // Filter out null values and remove duplicates
      const validPlayers = playersWithDetails
        .filter(player => player !== null)
        .filter((player, index, self) =>
          index === self.findIndex(p => p.id === player.id)
        );

      return {
        items: validPlayers,
        cartId: cart.id,
        userId: userInfo.id
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para agregar un jugador al carrito
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, playerId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ cartId: userId, playerId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para remover un jugador del carrito
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (playerId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let token = state.auth.token;
      
      // If not in Redux, try localStorage as fallback
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const cartId = state.cart.cartId;
      
      if (!cartId) {
        return rejectWithValue('No active cart found.');
      }

      const response = await fetch(`${API_BASE_URL}/cart-items/remove-from-cart?cartId=${cartId}&playerId=${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      
      return playerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para limpiar el carrito
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let token = state.auth.token;
      
      // If not in Redux, try localStorage as fallback
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const cartId = state.cart.cartId;
      const cartItems = state.cart.items;
      
      if (!cartId || !cartItems.length) {
        return { items: [] };
      }

      // Remove each item from the cart
      const deletePromises = cartItems.map(player =>
        fetch(`${API_BASE_URL}/cart-items/remove-from-cart?cartId=${cartId}&playerId=${player.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      
      // Check that all deletions were successful
      const failedRemovals = responses.filter(response => !response.ok);
      if (failedRemovals.length > 0) {
        throw new Error(`Failed to remove ${failedRemovals.length} items from cart`);
      }

      return { items: [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalAmount: 0,
    cartId: null,
    userId: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    calculateTotal: (state) => {
      state.totalAmount = state.items.reduce((total, item) => {
        return total + (item.price || 0);
      }, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
        state.userId = action.payload.userId;
        cartSlice.caseReducers.calculateTotal(state);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh cart after adding
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the item from the local state
        state.items = state.items.filter(item => item.id !== action.payload);
        cartSlice.caseReducers.calculateTotal(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError, calculateTotal } = cartSlice.actions;

// Selectores
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartId = (state) => state.cart.cartId;
export const selectCartUserId = (state) => state.cart.userId;

export default cartSlice.reducer;
