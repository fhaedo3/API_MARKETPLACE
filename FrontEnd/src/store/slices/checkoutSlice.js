import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

// Función para decodificar JWT
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

// Helper function to get userId from token
const getUserIdFromToken = async (token) => {
  try {
    const decoded = decodeToken(token);
    const username = decoded?.sub || decoded?.username || decoded?.name;
    if (!username) return null;

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) return null;
    
    const users = await response.json();
    const user = users.find(u => u.username === username);
    return user ? user.id : null;
  } catch (error) {
    console.error('Error getting userId from token:', error);
    return null;
  }
};

// Async thunk para procesar el pago
export const processPayment = createAsyncThunk(
  'checkout/processPayment',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let token = state.auth.token;
      
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const { cartItems, cardData } = paymentData;
      
      // Obtener el userId real del token
      const actualUserId = await getUserIdFromToken(token);
      if (!actualUserId) {
        return rejectWithValue('Could not get user ID from token.');
      }
      
      console.log('Processing payment for user ID:', actualUserId);
      
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Processing payment for user:', actualUserId);
      console.log('Cart items:', cartItems);
      
      // Crear transacciones reales para transferir jugadores
      const transferPromises = cartItems.map(async (item) => {
        const player = item.player || item;
        console.log('Processing transfer for player:', {
          playerId: player.id,
          playerName: player.name,
          sellerId: player.ownerId || player.owner?.id,
          buyerId: actualUserId,
          price: player.price
        });
        
        const response = await fetch(`${API_BASE_URL}/transactions/create-transfer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            sellerId: player.ownerId || player.owner?.id,
            buyerId: actualUserId,
            playerId: player.id,
            total: player.price
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Transfer failed for player:', player.name, 'Error:', errorText);
          throw new Error(`Error processing transfer for ${player.name}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Transfer successful for player:', player.name, 'Result:', result);
        return result;
      });

      await Promise.all(transferPromises);
      
      // Retornar respuesta exitosa
      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        amount: cartItems.reduce((total, item) => total + (item.price || 0), 0),
        purchasedPlayers: cartItems
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para transferir jugadores al equipo del usuario (alternativo - no usado actualmente)
export const transferPlayersToTeam = createAsyncThunk(
  'checkout/transferPlayersToTeam',
  async (playerIds, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let token = state.auth.token;
      const userId = state.auth.userId;
      
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      if (!token || !userId) {
        return rejectWithValue('Authentication required.');
      }

      // Simulamos el proceso ya que las transferencias se hacen en processPayment
      console.log('Transferring players:', playerIds, 'to user:', userId);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    loading: false,
    processing: false,
    error: null,
    paymentSuccess: false,
    transactionId: null,
    transferComplete: false,
  },
  reducers: {
    clearCheckoutError: (state) => {
      state.error = null;
    },
    resetCheckout: (state) => {
      state.loading = false;
      state.processing = false;
      state.error = null;
      state.paymentSuccess = false;
      state.transactionId = null;
      state.transferComplete = false;
    },
    setProcessing: (state, action) => {
      state.processing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.processing = false;
        state.paymentSuccess = true;
        state.transactionId = action.payload.transactionId;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      // Transfer players
      .addCase(transferPlayersToTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferPlayersToTeam.fulfilled, (state) => {
        state.loading = false;
        state.transferComplete = true;
      })
      .addCase(transferPlayersToTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutError, resetCheckout, setProcessing } = checkoutSlice.actions;

// Selectores
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectCheckoutProcessing = (state) => state.checkout.processing;
export const selectCheckoutError = (state) => state.checkout.error;
export const selectPaymentSuccess = (state) => state.checkout.paymentSuccess;
export const selectTransactionId = (state) => state.checkout.transactionId;
export const selectTransferComplete = (state) => state.checkout.transferComplete;

export default checkoutSlice.reducer;
