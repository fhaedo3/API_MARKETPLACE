import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = 'http://localhost:8080/players/public';

export const fetchPlayers = createAsyncThunk("players/fetchPlayers", async () => {
    const {data}= await axios.get(URL);
    return data;
});

export const createPlayer = createAsyncThunk("players/createPlayer", async(newPlayer)=>{
    const {data} = await  axios.post(URL, newPlayer)
    return data;
});

export const UpdatePlayer = createAsyncThunk("players/updatePlayer", async(updatedPlayer)=>{
    const {id, body} = updatedPlayer;
    const {data} = await axios.put(`${URL}/${id}`, {body});
    return data;
});

export const deletePlayer = createAsyncThunk("players/deletePlayer", async(deletedPlayer)=>{
    const {id} = deletedPlayer;
    const {data} = await axios.delete(`${URL}/${id}`);
    return data; // devuelve el id del jugador eliminado para que pueda ser utilizado en el reducer
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
        })
        .addCase(createPlayer.fulfilled, (state, action) => {
            state.loading=false;
            state.items = [...state.items, action.payload] // agrega el nuevo jugador al estado global.
        })
        .addCase(updatedPlayer.fulfilled, (state, action) => {
            const index = state.items.findIndex(player=> player.id === action.payload.id);
            if(index !== -1) {
                state.items[index] = action.payload; // actualiza el jugador en el estado global.
            }//action.payload contiene los nuevos datos del post que realice en la llamada a la api. Que fue asincrona UpdatePlayer
        })
        .addCase(deletePlayer.fulfilled, (state, action) => {
            const index = state.items.findIndex(player => player.id === action.payload.id);
            if (index !== -1) {
                state.items.splice(index, 1); // elimina el jugador del estado global.
            }
        });
    },
});

export default PlayerSlice.reducer;// incluye la logica para actualizar el estado de los jugadores y conecta al store de redux cada vez que una de estas acciones pase.
