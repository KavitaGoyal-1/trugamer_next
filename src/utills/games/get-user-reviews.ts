import axios from "axios";
import { getApi } from "../get-api";

export const getUserReview = async (slug?: string) => {
  console.log("rating 4");
  if (slug === undefined) {
    return null;
  }
  try {
    const { data } = await axios.get(`${getApi()}/game-rating/${slug}`);
    return data;
  } catch (error) {
    return null;
  }
};
