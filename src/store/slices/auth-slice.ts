import { createSlice } from "@reduxjs/toolkit";

export interface IAuthData {
  userData: {
    id?: number | null;
    username: string | null;
    email: string | null;
    country?: string | null;
    picture?: {
      id: number | null;
      height: number | null;
      url: string | null;
      width: number | null;
    } | null;
    playingNow: [];
    playing_now: [];
    playing_next: [];
    playingNext: [];
    beaten_games: [];
    games_library: [];
    gamesLibrary: [];
    played_hour: [];
    shelvedGames: [];
    shelvedGameForDevices: any;
    confirmed?: boolean;
    blocked?: boolean;
    favouriteGenres?: [];
    xboxLiveGamerTagId?: number | null;
    twitchId?: number | null;
    playstationNetworkId?: number | null;
    nintendoNetworkId?: number | null;
    eaAppId?: number | null;
    ubiSoftConnetId?: number | null;
    steamId?: number | null;
    nintendoSwitchId?: number | null;
    gamer_tag?: number | null;
    login_first_time?: boolean;
    user_gamer_tag: [];
  };
  headerToggle: boolean;
  checking: boolean;
  hRemember: boolean | null;
  googleErrorMsg: string | null;
}
const initialState: IAuthData = {
  userData: {
    id: null,
    username: null,
    email: null,
    country: null,
    picture: null,
    playingNow: [],
    playing_now: [],
    playing_next: [],
    playingNext: [],
    beaten_games: [],
    games_library: [],
    gamesLibrary: [],
    played_hour: [],
    shelvedGameForDevices: [],
    shelvedGames: [],
    favouriteGenres: [],
    xboxLiveGamerTagId: null,
    twitchId: null,
    playstationNetworkId: null,
    nintendoNetworkId: null,
    eaAppId: null,
    ubiSoftConnetId: null,
    steamId: null,
    nintendoSwitchId: null,
    gamer_tag: null,
    login_first_time: false,
    user_gamer_tag: [],
  },
  headerToggle: false,
  checking: false,
  hRemember: false,
  googleErrorMsg: null,
};
const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {
    signIn: (state, action) => {
      let { userData, checking, hRemember, shelvedGameForDevices } =
        action.payload;
      state.userData = {
        ...userData,
        shelvedGameForDevices,
      };
      state.checking = checking;
      state.hRemember = hRemember;
      state.googleErrorMsg = null;
    },
    status: (state, action) => {
      let { userData } = action.payload;
      let temp = state?.userData;
      temp.playing_now = userData.playing_now;
      temp.playingNow = userData.playingNow;
      temp.playing_next = userData.playing_next;
      temp.playingNext = userData.playingNext;
      temp.beaten_games = userData.beaten_games;
      temp.games_library = userData.games_library;
      temp.gamesLibrary = userData.gamesLibrary;
      temp.played_hour = userData.played_hour;
      state.userData = temp;
    },

    logOut: () => initialState,
    startChecking: (state) => {
      state.checking = true;
    },
    endChecking: (state) => {
      state.checking = false;
    },
    authError: (state) => {
      state.checking = false;
    },
    googleError: (state, action) => {
      state.googleErrorMsg = action.payload;
    },
    setHRemember: (state, action) => {
      state.hRemember = action.payload;
    },
    storeHeaderToggle: (state, action) => {
      state.headerToggle = !state.headerToggle;
    },
    storeOutsideToggle: (state, action) => {
      state.headerToggle = action.payload;
    },
  },
});

export const {
  signIn,
  status,
  logOut,
  startChecking,
  authError,
  setHRemember,
  endChecking,
  googleError,
  storeHeaderToggle,
  storeOutsideToggle,
} = authSlice.actions;

export const selectAuthState = (state: any) => state.authState;
export default authSlice.reducer;
