import axios from "axios";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import { INewRelease } from "@/types/new-release";
import { IGame } from "@/types/game";

export const getNewReleases = async (
  query?: string
): Promise<INewRelease[] | null> => {
  const token = getToken();
  try {
    const { data } = await axios.get(`${getApi()}/new-releases${query}`, {
      headers: { Authorization: token && `Bearer ${token}` },
    });

    return data.data;
  } catch (error) {
    return null;
  }
};

export const getNewReleasesFunc = async (
  query?: string
): Promise<INewRelease[] | null> => {
  const token = getToken();
  try {
    const { data } = await axios.get(`${getApi()}/new-releases${query}`, {
      headers: { Authorization: token && `Bearer ${token}` },
    });
    const sortedData = data?.data.sort((a: any, b: any) => {
      return (
        parseInt(b.attributes.game.data.attributes.played) -
        parseInt(a.attributes.game.data.attributes.played)
      );
    });
    return sortedData;
  } catch (error) {
    return null;
  }
};
export const getGames = async (query?: string): Promise<IGame[] | null> => {
  const token = getToken();

  try {
    const { data } = await axios.get(`${getApi()}/games${query}`, {
      headers: { Authorization: token && `Bearer ${token}` },
    });
    return data.data;
  } catch (error) {
    return null;
  }
};

// export const getGameAnalytics = async (slug: string) => {
//   const token = getToken();
//   try {
//     const data = (
//       await axios.get(`${getApi()}/game/getAnalytics/${slug}`, {
//         headers: { Authorization: token && `Bearer ${token}` },
//       })
//     ).data;

//     if (data) return data;
//     else null;
//   } catch (error) {
//     return error;
//   }
// };

export const getGameAnalytics = async (slug: string) => {
  const token = getToken();
  try {
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    const response = await axios.get(
      `${getApi()}/game/getAnalytics/${slug}`,
      config
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching game analytics:", error);
    return null;
  }
};

export const getGameStatsCount = async (id: number) => {
  try {
    const data = (
      await axios.get(`${getApi()}/users-playing-now-shelved-count/${id}`)
    ).data;
    if (data) return data;
    else null;
  } catch (error) {
    return error;
  }
};
