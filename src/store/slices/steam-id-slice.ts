import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SteamState {
  steamId: number | 0;
}

const initialState: SteamState = {
  steamId: 0,
};

const steamSlice = createSlice({
  name: "steam",
  initialState,
  reducers: {
    setSteamId(state, action: PayloadAction<number | 0>) {
      state.steamId = action.payload;
    },
    clearSteamId(state) {
      state.steamId = 0;
    },
  },
});

export const { setSteamId, clearSteamId } = steamSlice.actions;

export default steamSlice.reducer;
