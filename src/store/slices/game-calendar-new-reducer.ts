import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  search: string;
  genres: string[];
  sort: {
    by: string;
    order: string;
  };
  timeframe: {
    frame: string;
    range: string;
    direction: string;
  };
  gamemode: string[];
  themes: string[];
  playerperspectives: string[];
  gametype: Record<string, any>;
  onlyAnticipated: Boolean;
  devices: string[];
  apiResponse: any;
  apiResponseLoading: Boolean;
  usersDevices: Boolean;
}

export const gameCalendarNewInitialState: FilterState = {
  search: "",
  genres: [],
  sort: {
    by: "anticipated",
    order: "asc",
  },
  timeframe: {
    frame: "weekly",
    range: new Date().toLocaleDateString("sv-SE"),
    direction: "up",
  },
  gamemode: [],
  themes: [],
  playerperspectives: [],
  gametype: {
    expansion: false,
    season: false,
    base: true,
  },
  onlyAnticipated: false,
  devices: [],
  apiResponse: [],
  apiResponseLoading: true,
  usersDevices: false,
};

const gameCalendarNewSlice = createSlice({
  name: "gameCalendarNew",
  initialState: gameCalendarNewInitialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setGenres(state, action: PayloadAction<string[]>) {
      state.genres = action.payload;
    },
    setSort(state, action: PayloadAction<{ by: string; order: string }>) {
      state.sort = action.payload;
    },
    setTimeframe(
      state,
      action: PayloadAction<{ frame: string; range: string; direction: string }>
    ) {
      state.timeframe = action.payload;
    },
    setGamemode(state, action: PayloadAction<string[]>) {
      state.gamemode = action.payload;
    },
    setThemes(state, action: PayloadAction<string[]>) {
      state.themes = action.payload;
    },
    setPlayerPerspectives(state, action: PayloadAction<string[]>) {
      state.playerperspectives = action.payload;
    },
    setGameType(state, action: PayloadAction<Record<string, any>>) {
      state.gametype = action.payload;
    },
    setDevices(state, action: PayloadAction<string[]>) {
      state.devices = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, gameCalendarNewInitialState);
    },
    setGameCalendarNewApiResponse(state, action: PayloadAction<any>) {
      state.apiResponse = action.payload;
    },
    setGameCalendarNewApiResponseLoading(
      state,
      action: PayloadAction<Boolean>
    ) {
      state.apiResponseLoading = action.payload;
    },
    setonlyAnticipated(state, action: PayloadAction<Boolean>) {
      console.log(
        action.payload,
        " action.payload this is in only anicipated --- "
      );
      state.onlyAnticipated = action.payload;
    }, //usersDevices

    setUsersOwnDevices(state, action: PayloadAction<Boolean>) {
      state.usersDevices = action.payload;
    },
  },
});

export const {
  setSearch,
  setGenres,
  setSort,
  setTimeframe,
  setGamemode,
  setThemes,
  setPlayerPerspectives,
  setGameType,
  setDevices,
  resetFilters,
  setGameCalendarNewApiResponse,
  setGameCalendarNewApiResponseLoading,
  setonlyAnticipated,
  setUsersOwnDevices,
} = gameCalendarNewSlice.actions;

export default gameCalendarNewSlice.reducer;
