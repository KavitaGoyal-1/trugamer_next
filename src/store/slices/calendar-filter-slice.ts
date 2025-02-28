import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const today = new Date();

interface NewsState {
  search: string;
  sortby: string;
  genres: string[];
  timeframe: {
    frame: string;
    range: string;
    year: string;
  };
  gamemode: string[];
  devices: string[];
  themes: string[];
  ratings: string;
  playerperspectives: string[];
  uppertimeframe: {
    frame: string;
    range: string;
    year: string;
  };
  downframe: {
    frame: string;
    range: string;
    year: string;
  };
}

interface CalendarFiltersState {
  filter: NewsState;
  isFilter: boolean;
}

// Initial state
const filter: NewsState = {
  search: "",
  sortby: "",
  genres: [],
  timeframe: {
    frame: "daily",
    range: today.toISOString().split("T")[0], // Current week
    year: today.getFullYear().toString(), // Current year
  },
  uppertimeframe: {
    frame: "daily",
    range: today.toISOString().split("T")[0], // Current week
    year: today.getFullYear().toString(), // Current year
  },
  downframe: {
    frame: "daily",
    range: today.toISOString().split("T")[0], // Current week
    year: today.getFullYear().toString(), // Current year
  },
  gamemode: [],
  devices: [],
  ratings: "",
  themes: [],
  playerperspectives: [],
};

// Initial state for the slice
const initialState: CalendarFiltersState = {
  filter,
  isFilter: false,
};

const calendarFilters1 = createSlice({
  name: "calendarFilters",
  initialState,
  reducers: {
    setcalendarFilter(state, action: PayloadAction<NewsState>) {
      state.filter = action.payload;
    },
    setcalendarboolean(state) {
      state.isFilter = true; // Set isFilter to true
    },
    clearCalendarFilter(state) {
      //  state.filter = { ...filter };
      state.isFilter = false; // Set isFilter to false
    },
    clearFilters(state) {
      state.filter = JSON.parse(JSON.stringify(initialState.filter)); // Deep clone the initial filter
      state.isFilter = false; //
    },
  },
});

export const {
  setcalendarFilter,
  clearCalendarFilter,
  setcalendarboolean,
  clearFilters,
} = calendarFilters1.actions;

export default calendarFilters1.reducer;
