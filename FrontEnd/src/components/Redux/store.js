import {configureStore} from '@reduxjs/toolkit';
import  playerReducer from './PlayerSlice';

export const store= configureStore({
    reducer: { Players: playerReducer },
}); 