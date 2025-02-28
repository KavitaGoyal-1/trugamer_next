// redux/slices/progressSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  progressPercent: number;
  totalUploadGames: number;
  pendingUploadGames: number;
  openUploadProgressModal: boolean;
  syncInProgress: boolean;
  estimatedTime: number;
}

const initialState: ProgressState = {
  progressPercent: 0,
  totalUploadGames: 0,
  pendingUploadGames: 0,
  openUploadProgressModal: false,
  syncInProgress: false,
  estimatedTime: 0,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgressState: (
      state,
      action: PayloadAction<Partial<ProgressState>>
    ) => {
      return { ...state, ...action.payload }; // Update only provided fields
    },
    resetProgressState: () => initialState, // Reset to initial state
  },
});

export const { setProgressState, resetProgressState } = progressSlice.actions;
export default progressSlice.reducer;
