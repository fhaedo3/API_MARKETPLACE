import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

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

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Helper function to get token from state
const getToken = (getState) => {
  const state = getState();
  return state.auth?.token || null;
};

// Async thunk para obtener información del usuario
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        if (response.status === 404) {
          return rejectWithValue('User not found.');
        }
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener información del usuario por username
export const fetchUserByUsername = createAsyncThunk(
  'user/fetchUserByUsername',
  async (username, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      if (!username || username.trim() === '') {
        return rejectWithValue('Username is required.');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        throw new Error(`Error fetching users: ${response.status}`);
      }
      
      const users = await response.json();
      const user = users.find(u => 
        u.username && 
        u.username.trim().toLowerCase() === username.trim().toLowerCase()
      );
      
      if (!user) {
        return rejectWithValue(`User not found with username: ${username}`);
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener el usuario actual desde el token
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.sub) {
        return rejectWithValue('Invalid authentication token.');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        throw new Error(`Error fetching users: ${response.status}`);
      }
      
      const users = await response.json();
      const user = users.find(u => 
        u.username && 
        u.username.trim().toLowerCase() === decodedToken.sub.trim().toLowerCase()
      );
      
      if (!user) {
        return rejectWithValue(`Current user not found: ${decodedToken.sub}`);
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para actualizar el perfil del usuario
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      if (!userId || !userData) {
        return rejectWithValue('User ID and user data are required.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        if (response.status === 404) {
          return rejectWithValue('User not found.');
        }
        if (response.status === 400) {
          return rejectWithValue('Invalid user data provided.');
        }
        throw new Error(`Failed to update user profile: ${response.status}`);
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
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      if (!userId) {
        return rejectWithValue('User ID is required.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
        headers: getAuthHeaders(token),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        if (response.status === 404) {
          return rejectWithValue('User balance not found.');
        }
        throw new Error(`Failed to fetch user balance: ${response.status}`);
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
  async ({ userId, amount }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }

      if (!userId || amount === undefined || amount === null) {
        return rejectWithValue('User ID and amount are required.');
      }

      if (typeof amount !== 'number') {
        return rejectWithValue('Amount must be a number.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Unauthorized access. Please login again.');
        }
        if (response.status === 404) {
          return rejectWithValue('User not found.');
        }
        if (response.status === 400) {
          return rejectWithValue('Invalid amount provided.');
        }
        throw new Error(`Failed to update user balance: ${response.status}`);
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
      state.error = null;
      state.balanceError = null;
    },
    setUserBalance: (state, action) => {
      state.balance = action.payload;
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
      // Fetch user by username
      .addCase(fetchUserByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
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

export const { clearUserError, setUserProfile, clearUserProfile, setUserBalance } = userSlice.actions;

// Selectores
export const selectUserProfile = (state) => state.user.profile;
export const selectUserBalance = (state) => state.user.balance;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectBalanceLoading = (state) => state.user.balanceLoading;
export const selectBalanceError = (state) => state.user.balanceError;

export default userSlice.reducer;
