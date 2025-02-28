import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Game = { id: number };

interface GameDataState {
  games: Game[];
  pageNumber: number;
}
const initialState: GameDataState = {
  games: [],
  pageNumber: 1,
};

const gameCalendarDataSlice = createSlice({
  name: "gameData",
  initialState,
  reducers: {
    fetchGamesSuccess(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    // New actions added
    fetchDataFromRedux(state) {
      // Logic to fetch data from Redux
      // Example:
      state.games = []; // Reset games array or do other actions as needed
    },
    setDataToRedux(state, action: PayloadAction<Game[]>) {
      state.games = action.payload;
    },
  },
});

export const {
  fetchGamesSuccess,
  setPageNumber,
  fetchDataFromRedux,
  setDataToRedux,
} = gameCalendarDataSlice.actions;

export default gameCalendarDataSlice.reducer;
