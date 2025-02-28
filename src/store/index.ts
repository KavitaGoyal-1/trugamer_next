// @ts-ignore
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import authReducer from "./slices/auth-slice";
import gameDataReducer from "./slices/game-data-slice";
import newsReducer from "./slices/new-slice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import gameCalenderDataReducer from "./slices/game-calendar-slice";
import scrollSlice from "./slices/scroll-slice";
import calendarFilters from "./slices/calendar-filter-slice";
import gameLibrarySlice from "./slices/game-library";
import steamIdSlice from "./slices/steam-id-slice";
import searchGameSlice from "./slices/search-game-slice";
import gameCalendarNewReducer from "./slices/game-calendar-new-reducer";
import gameHourSlice from "./slices/game-hours";
import progressReducer from "./slices/progress-slice";
import modalReducer from "./slices/modal-slice";
import userDevices from "./slices/user-saved-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authState", "steamIdSlice", "progress", "modal"],
};

const rootReducer = combineReducers({
  authState: authReducer,
  gameData: gameDataReducer,
  gameCalendar: gameCalenderDataReducer,
  news: newsReducer,
  scrollSlice: scrollSlice,
  calendarFilters: calendarFilters,
  gameLibrary: gameLibrarySlice,
  steamIdSlice: steamIdSlice,
  searchGameSlice: searchGameSlice,
  gameCalendarNew: gameCalendarNewReducer,
  gameHourSlice: gameHourSlice,
  progress: progressReducer,
  modal: modalReducer,
  userDevices: userDevices,
});

const presistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: presistedReducer,
  //   middleware: [thunk],
});
