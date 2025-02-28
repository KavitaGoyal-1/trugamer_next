import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameHourState {
  data: any; // Replace with a specific type if available
  visible: any;
}

const initialState: GameHourState = {
  data: null,
  visible: true,
};

const gameHourSlice = createSlice({
  name: "gameHour",
  initialState,
  reducers: {
    updateGameStatus(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    toggleVisibility(state, action: PayloadAction<any>) {
      state.visible = action?.payload; // Toggles the visibility state
    },
  },
});

export const { updateGameStatus, toggleVisibility } = gameHourSlice.actions;

export default gameHourSlice.reducer;
