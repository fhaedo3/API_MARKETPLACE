import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlayerImageUrl } from '../../utils/imageUtils';

// Async thunks
export const fetchAllPlayers = createAsyncThunk(
  'players/fetchAllPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/players/public');
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      
      return data.map(player => ({
        id: player.id ?? '',
        name: player.name ?? '',
        lastName: player.lastName ?? '',
        position: player.position ?? '',
        rating: player.rating ?? 0,
        characteristics: player.characteristics
          ? Array.isArray(player.characteristics)
            ? player.characteristics
            : player.characteristics.split(',').map(c => c.trim())
          : [],
        price: player.price ?? 0,
        isForSale: player.isForSale ?? false,
        image: getPlayerImageUrl(player),
        clubName: player.clubName,
        owner: {
          id: player.ownerId,
          clubName: player.clubName,
          username: player.ownerName
        }
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (playerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`http://localhost:8080/players/${playerId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        throw new Error('Player not found');
      }
      
      const data = await response.json();
      data.characteristics = data.characteristics
        ? Array.isArray(data.characteristics)
          ? data.characteristics
          : data.characteristics.split(',').map(c => c.trim())
        : [];
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlayersByOwner = createAsyncThunk(
  'players/fetchPlayersByOwner',
  async (ownerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`http://localhost:8080/players/owner/${ownerId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error('Failed to fetch players');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPlayer = createAsyncThunk(
  'players/createPlayer',
  async (playerData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      const formDataToSend = new FormData();
      formDataToSend.append('player', new Blob([JSON.stringify(playerData)], {
        type: 'application/json'
      }));

      const response = await fetch('http://localhost:8080/players', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating player: ${response.status} - ${errorText}`);
      }

      const newPlayer = await response.json();
      
      // Asegurar que el jugador tenga la imagen
      if (newPlayer && !newPlayer.image && playerData.image) {
        newPlayer.image = playerData.image;
      }
      
      return newPlayer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  allPlayers: [],
  currentPlayer: null,
  userPlayers: [],
  loading: false,
  error: null,
  filters: {
    position: '',
    saleStatus: '',
    searchTerm: '',
  },
};

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setPositionFilter: (state, action) => {
      state.filters.position = action.payload;
    },
    setSaleStatusFilter: (state, action) => {
      state.filters.saleStatus = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        position: '',
        saleStatus: '',
        searchTerm: '',
      };
    },
    clearCurrentPlayer: (state) => {
      state.currentPlayer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all players
      .addCase(fetchAllPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlayers = action.payload;
      })
      .addCase(fetchAllPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch player by ID
      .addCase(fetchPlayerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch players by owner
      .addCase(fetchPlayersByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayersByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlayers = action.payload;
      })
      .addCase(fetchPlayersByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create player
      .addCase(createPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlayers.push(action.payload);
        state.userPlayers.push(action.payload);
      })
      .addCase(createPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllPlayers = (state) => state.players.allPlayers;
export const selectCurrentPlayer = (state) => state.players.currentPlayer;
export const selectUserPlayers = (state) => state.players.userPlayers;
export const selectPlayersLoading = (state) => state.players.loading;
export const selectPlayersError = (state) => state.players.error;
export const selectAvailablePositions = (state) => {
  const positions = state.players.allPlayers.map(p => p.position);
  return [...new Set(positions)].filter(Boolean);
};

export const selectFilteredPlayers = (state) => {
  const { allPlayers, filters } = state.players;
  let filtered = [...allPlayers];

  // Filter by search term
  if (filters.searchTerm.trim() !== '') {
    const term = filters.searchTerm.trim().toLowerCase();
    filtered = filtered.filter(p =>
      (p.name + ' ' + (p.lastName || '')).toLowerCase().includes(term)
    );
  }

  // Filter by position
  if (filters.position !== '') {
    filtered = filtered.filter(p => p.position === filters.position);
  }

  // Filter by sale status
  if (filters.saleStatus !== '') {
    if (filters.saleStatus === 'for-sale') {
      filtered = filtered.filter(p => p.isForSale === true);
    } else if (filters.saleStatus === 'not-for-sale') {
      filtered = filtered.filter(p => p.isForSale === false);
    }
  }

  return filtered;
};

export const { 
  setFilters, 
  setSearchTerm, 
  setPositionFilter, 
  setSaleStatusFilter, 
  clearFilters, 
  clearCurrentPlayer, 
  clearError 
} = playerSlice.actions;
export default playerSlice.reducer;
