import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type Game = { id: number };

interface GameDataState {
  games: Game[];
  pageNumber: number;
  gameRating: number;
}

const initialState: GameDataState = {
  games: [],
  pageNumber: 1,
  gameRating: 0,
};

const gameDataSlice = createSlice({
  name: "gameData",
  initialState,
  reducers: {
    fetchGamesSuccess(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setNewGameRating(state, action: PayloadAction<number>) {
      state.gameRating = action.payload;
    },
  },
});

export const { fetchGamesSuccess, setPageNumber, setNewGameRating } =
  gameDataSlice.actions;

export default gameDataSlice.reducer;
