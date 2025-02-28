import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import axios from "axios";

export const addPlayedHour = async (payload: any) => {
  const token = getToken();
  try {
    const resp = await (
      await axios.post(
        `${getApi()}/users-permissions/user/played_hour`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).data;
    if (resp) {
      return resp;
    }
    return null;
  } catch (error: any) {
    const err = error?.response?.data?.error || "Something went wrong";
    throw err;
  }
};

export const getAnalytics = async () => {
  const token = getToken();
  try {
    const resp = await (
      await axios.get(`${getApi()}/users-permissions/user/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
    if (resp) {
      return resp;
    }
    return null;
  } catch (error: any) {
    const err = error?.response?.data?.error || "Something went wrong";
    throw err;
  }
};

export const updatePlayingNowDevice = async (payload: any) => {
  const token = getToken();
  let url = `${getApi()}/users-permissions/user/updateDevice/test`;

  try {
    const data = (
      await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;

    return data;
  } catch (error) {
    return null;
  }
};

export const updateGameDevice = async (type: string, payload: any) => {
  let url = "";
  if (type === "playing-now") {
    url = `${getApi()}/users-permissions/user/updateDevice/test`;
  } else if (type === "playing-next") {
    url = `${getApi()}/users-permissions/user/playing-next/updateDevice`;
  } else if (type === "library") {
    url = `${getApi()}/users-permissions/user/library/update`;
  } else {
    throw new Error("Invalid type");
  }

  const token = getToken();

  try {
    const data = (
      await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;

    return data;
  } catch (error: any) {
    let err = error?.response?.data?.error || "Something went wrong";
    throw err;
  }
};
