import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  news: Array<any>, // Replace `any` with a more specific type if possible
  games: Array<any>,
};

const searchGameSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setNews(state, action) {
      state.news = action.payload;
    },
    setGames(state, action) {
      state.games = action.payload;
    },
    addNews(state: any, action: any) {
      state.news.push(action.payload);
    },
    addGame(state: any, action: any) {
      state.games.push(action.payload);
    },
    clearNews(state) {
      state.news = Array<any>;
    },
    clearGames(state) {
      state.games = Array<any>;
    },
    setQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearQuery(state) {
      state.searchQuery = "";
    },
  },
});

export const {
  setNews,
  setGames,
  addNews,
  addGame,
  clearNews,
  clearGames,
  setQuery,
  clearQuery,
} = searchGameSlice.actions;

export default searchGameSlice.reducer;
