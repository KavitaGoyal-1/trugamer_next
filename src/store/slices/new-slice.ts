import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewsItem } from "src/pages/news";
interface NewsState {
  items: NewsItem[];
  pageNumber: any;
}

// Initial state
const initialState: NewsState = {
  items: [],
  pageNumber: 1,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    fetchNewsSuccess: (state, action: PayloadAction<NewsItem[]>) => {
      state.items = action.payload;
    },
    setNewsPageNumber(state, action: PayloadAction<any>) {
      state.pageNumber = action.payload;
    },
  },
});

export const { fetchNewsSuccess, setNewsPageNumber } = newsSlice.actions;

export default newsSlice.reducer;
