import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewsState {
  isScrollOnTop: boolean;
  isUpword: boolean;
}

// Initial state
const initialState: NewsState = {
  isScrollOnTop: false,
  isUpword: false,
};

const scrollSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    setIsScrollOnTop(state, action: PayloadAction<boolean>) {
      state.isScrollOnTop = action.payload;
    },
    setIsUpWords(state, action: PayloadAction<boolean>) {
      state.isUpword = action.payload;
    },
  },
});

export const { setIsScrollOnTop, setIsUpWords } = scrollSlice.actions;

export default scrollSlice.reducer;
