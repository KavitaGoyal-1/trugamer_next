// modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpenWelcomeOne: false,
  },
  reducers: {
    openWelcomeOne: (state) => {
      state.isOpenWelcomeOne = true;
    },
    closeWelcomeOne: (state) => {
      state.isOpenWelcomeOne = false;
    },
  },
});

export const { openWelcomeOne, closeWelcomeOne } = modalSlice.actions;
export default modalSlice.reducer;
