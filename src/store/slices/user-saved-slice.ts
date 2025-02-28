import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface defining the structure of a device
interface UserDevice {
  id: number | null;
  name: string | null;
  slug: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// Initial state for the Redux slice
const initialUserDevicesState: UserDevice[] = [];

const userDeviceSlice = createSlice({
  name: "userDevices",
  initialState: initialUserDevicesState,
  reducers: {
    setAllUserDevices(state, action: PayloadAction<UserDevice[]>) {
      return action.payload;
    },
  },
});

export const { setAllUserDevices } = userDeviceSlice.actions;

export default userDeviceSlice.reducer;
