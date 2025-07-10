import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import playerSlice from './slices/playerSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import checkoutSlice from './slices/checkoutSlice';
import clubSlice from './slices/clubSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    players: playerSlice,
    cart: cartSlice,
    user: userSlice,
    checkout: checkoutSlice,
    clubs: clubSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Types for TypeScript would go here
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;