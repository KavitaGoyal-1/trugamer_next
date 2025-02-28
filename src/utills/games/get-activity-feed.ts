import axios from "axios";
import { getApi } from "../get-api";

export const getUsersActivity = async (gameId?: number) => {
  if (gameId === undefined) {
    return null;
  }
  try {
    const { data } = await axios.get(
      `${getApi()}/activity-feed/game/${gameId}`
    );
    return data;
  } catch (error) {
    return null;
  }
};
