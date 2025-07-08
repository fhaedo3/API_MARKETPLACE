import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

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

      const { cartItems, cardData, userId } = paymentData;
      
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí puedes agregar lógica para transferir jugadores al equipo del usuario
      // y limpiar el carrito después del pago exitoso
      
      // Simular respuesta exitosa
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

// Async thunk para transferir jugadores al equipo del usuario
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

      // Aquí implementarías la lógica para transferir jugadores
      // Por ahora simulamos el proceso
      const transferPromises = playerIds.map(async (playerId) => {
        const response = await fetch(`${API_BASE_URL}/players/${playerId}/transfer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newOwnerId: userId,
            transferType: 'PURCHASE'
          }),
        });
        
        return response.ok;
      });

      const results = await Promise.all(transferPromises);
      return results.every(result => result);
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
