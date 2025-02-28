import axios from "axios";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { IDevice } from "@/types/devices";

export const getDevices = async (): Promise<IDevice[] | null> => {
  const token = getToken();

  try {
    const { data } = await axios.get(
      `${getApi()}/devices?populate=icon.image`,
      {
        headers: { Authorization: token && `Bearer ${token}` },
      }
    );
    return data.data;
  } catch (error) {
    return null;
  }
};
