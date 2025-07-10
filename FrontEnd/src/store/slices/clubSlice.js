import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Async thunk para obtener información de un club específico
export const fetchClubById = createAsyncThunk(
  'clubs/fetchClubById',
  async (clubId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${clubId}`, {
        headers: token ? getAuthHeaders(token) : {},
      });

      if (!response.ok) {
        throw new Error(`Error fetching club details: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener todos los usuarios
export const fetchAllUsers = createAsyncThunk(
  'clubs/fetchAllUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: token ? getAuthHeaders(token) : {},
      });

      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk para obtener un usuario por username
export const fetchUserByUsername = createAsyncThunk(
  'clubs/fetchUserByUsername',
  async (username, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: token ? getAuthHeaders(token) : {},
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
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentClub: null,
  allUsers: [],
  loading: false,
  error: null,
  usersLoading: false,
  usersError: null,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    clearClubError: (state) => {
      state.error = null;
      state.usersError = null;
    },
    clearCurrentClub: (state) => {
      state.currentClub = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch club by ID
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      // Fetch user by username
      .addCase(fetchUserByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.loading = false;
        // Store the found user in currentClub for consistency
        state.currentClub = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectores
export const selectCurrentClub = (state) => state.clubs.currentClub;
export const selectAllUsers = (state) => state.clubs.allUsers;
export const selectClubLoading = (state) => state.clubs.loading;
export const selectClubError = (state) => state.clubs.error;
export const selectUsersLoading = (state) => state.clubs.usersLoading;
export const selectUsersError = (state) => state.clubs.usersError;

export const { clearClubError, clearCurrentClub } = clubSlice.actions;
export default clubSlice.reducer;