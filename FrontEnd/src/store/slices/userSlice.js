import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

// Async thunk para obtener información del usuario
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para actualizar el perfil del usuario
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener el balance del usuario
export const fetchUserBalance = createAsyncThunk(
  'user/fetchBalance',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`);
      if (!response.ok) {
        throw new Error('Failed to fetch user balance');
      }
      const data = await response.json();
      return data.balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para actualizar el balance del usuario
export const updateUserBalance = createAsyncThunk(
  'user/updateBalance',
  async ({ userId, amount }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user balance');
      }
      
      const data = await response.json();
      return data.balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    balance: 0,
    loading: false,
    error: null,
    balanceLoading: false,
    balanceError: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.balanceError = null;
    },
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.balance = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user balance
      .addCase(fetchUserBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchUserBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload;
      })
      // Update user balance
      .addCase(updateUserBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(updateUserBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload;
      })
      .addCase(updateUserBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload;
      });
  },
});

export const { clearUserError, setUserProfile, clearUserProfile } = userSlice.actions;

// Selectores
export const selectUserProfile = (state) => state.user.profile;
export const selectUserBalance = (state) => state.user.balance;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectBalanceLoading = (state) => state.user.balanceLoading;
export const selectBalanceError = (state) => state.user.balanceError;

export default userSlice.reducer;
