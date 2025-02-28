import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Game type
type Game = { id: number };

// Define the initial structure for your game library state
interface GameLibraryState {
  gamesLibraryData: Game[];
  searchValue: string;
  hoursSlider: boolean;
  filters: {
    playStatus: string[];
    gameProgress: string[];
    viewBy: string;
    // sortBy: string; //{}
    sort: {
      sortBy: "lastplayed" /* this is for how user want to sort "title", "lastplayed", "totalhours", or "date" */;
      order: "DESC"; //  "asc" or "desc"
    };
    devices: string[];
    game_modes: string[];
    selectedHours: {
      // this is for slider range if user select hors Optional range filter (used only for "totalhours")
      min: 0;
      max: 600;
    };
  };
}

// Initial state
const initialState: GameLibraryState = {
  gamesLibraryData: [],
  searchValue: "",
  hoursSlider: false,
  filters: {
    playStatus: [],
    gameProgress: [],
    viewBy: "",
    // sortBy: "", // {"by": "",      "order": "ASC"  }

    sort: {
      sortBy:
        "lastplayed" /* this is for how user want to sort "title", "lastplayed", "totalhours", or "date" */,
      order: "DESC", //  "asc" or "desc"
    },

    devices: [],
    game_modes: [],
    selectedHours: {
      // this is for slider range if user select hors Optional range filter (used only for "totalhours")
      min: 0,
      max: 600,
    },
  },
};

// Create the slice
const gameLibrarySlice = createSlice({
  name: "gameLibrary",
  initialState,
  reducers: {
    // Action to set game library data
    fetchGamesLibraryDataSuccess(state, action: PayloadAction<Game[]>) {
      state.gamesLibraryData = action.payload;
    },

    // Action to set search value
    searchGamesLibrary(state, action: PayloadAction<any>) {
      state.searchValue = action.payload.search;
    },

    // Action to add a filter
    addFilter(state, action: PayloadAction<any>) {
      const { filterType, filterKey } = action.payload.data;

      if (filterType === "viewBy") {
        state.filters.viewBy =
          state.filters.viewBy === filterKey ? null : filterKey;
      }

      if (filterType === "sort") {
        state.filters.sort =
          state.filters.sort === filterKey ? null : filterKey;
      }

      if (filterType === "playStatus") {
        state.filters.playStatus =
          state.filters.playStatus === filterKey ? null : filterKey;
      }

      if (filterType === "gameProgress") {
        state.filters.gameProgress =
          state.filters.gameProgress === filterKey ? null : filterKey;
      }

      if (filterType === "devices") {
        state.filters.devices =
          state.filters.devices === filterKey ? null : filterKey;
      }

      if (filterType === "game_modes") {
        state.filters.game_modes =
          state.filters.game_modes === filterKey ? null : filterKey;
      }
      if (filterType === "selectedHours") {
        state.filters.selectedHours =
          state.filters.selectedHours === filterKey ? null : filterKey;
      }
    },
    clearFilters(state) {
      state.filters = {
        playStatus: [],
        gameProgress: [],
        viewBy: "",
        sort: {
          sortBy:
            "lastplayed" /* this is for how user want to sort "title", "lastplayed", "totalhours", or "date" */,
          order: "DESC", //  "asc" or "desc"
        },
        devices: [],
        game_modes: [],
        selectedHours: {
          // this is for slider range if user select hors Optional range filter (used only for "totalhours")
          min: 0,
          max: 600,
        },
      };
    },
    toggleHoursSlider(state, action: PayloadAction<any>) {
      state.hoursSlider = action?.payload; // Toggles the visibility state
    },
  },
});

// Export actions
export const {
  fetchGamesLibraryDataSuccess,
  searchGamesLibrary,
  addFilter,
  clearFilters,
  toggleHoursSlider,
} = gameLibrarySlice.actions;

// Export the reducer
export default gameLibrarySlice.reducer;
