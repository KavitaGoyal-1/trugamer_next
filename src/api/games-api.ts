import axios from "axios";
import API_URL from "./api-url";

export const getCalendarGames = async (filters: object) => {
  return axios.post(`${API_URL.Calendar_Games}`, filters);
};
