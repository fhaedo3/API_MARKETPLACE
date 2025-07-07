import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = 'http://localhost:8080/players/public';

export const fetchPlayers = createAsyncThunk("players/fetchPlayers", async () => {
    const {data}= await axios.get(URL);
    return data;
});

const PlayerSlice = createSlice({
    name : "Players",
    initialState:{
        items:[],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder)=>{
    builder
        .addCase(fetchPlayers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPlayers.fulfilled, (state, action) => { // el parametro action contiene los datos devueltos por el thunk
            state.loading= false;
            state.items= action.payload // almacene los datos que obtuve en mi estado global
        })
        .addCase(fetchPlayers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // almacene el error en mi estado global
        });
    },
});

export default PlayerSlice.reducer;// incluye la logica para actualizar el estado de los jugadores y conecta al store de redux cada vez que una de estas acciones pase.
