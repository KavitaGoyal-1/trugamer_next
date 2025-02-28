import axios from "axios";
import { getApi } from "../get-api";
import { getToken } from "../cookies";
// export const getGameBySlug = async (slug: string | undefined) => {
//   const token = getToken();
//   if (slug === undefined) {
//     return null;
//   }
//   try {
//     const { data } = await axios.get(
//       `${getApi()}/games?filters[slug][$eq]=${slug}&populate=releaseByPlatforms.release.device.icon.url&populate=releaseByPlatforms.release.device.icon.alt&populate=releaseByPlatforms.release.device.logo.url&populate=releaseByPlatforms.release.device.logo.alt&populate=image&populate=coverImage&populate=screenshots&populate=categories&populate=devices.icon.image&populate=devices.icon.alt&populate=devices.logo.image&populate=devices.logo.alt&populate=developer&populate=publisher&populate=links&populate=stores&populate=related_games.image&populate=related_games.coverImage&populate=related_games.devices.icon.url&populate=related_games.devices.icon.alt&populate=related_games.devices.logo.url&populate=related_games.devices.logo.alt&populate=related_games.releaseByPlatforms.release.device&populate=game_preview.preview&populate=expansions.image&populate=expansions.coverImage&populate=expansions.devices.icon.url&populate=expansions.devices.icon.alt&populate=expansions.devices.logo.url&populate=expansions.devices.logo.alt&populate=seasons.image&populate=seasons.coverImage&populate=seasons.devices.icon.url&populate=seasons.devices.icon.alt&populate=seasons.devices.logo.url&populate=seasons.devices.logo.alt`,
//       {
//         headers: {
//           Authorization: token && `Bearer ${token}`,
//         },
//       }
//     );

//     const metaObj = {
//       ogImage: data?.data[0]?.attributes?.coverImage?.data?.attributes?.url
//         ? data?.data[0]?.attributes?.coverImage?.data?.attributes?.url
//         : "https://trugamer.com/logo.svg",
//       ogTitle: data?.data[0]?.attributes?.title,
//     };
//     let metaResponse;
//     if (data) {
//       metaResponse = await axios.post(`${getApi()}/all/metas`, metaObj);
//     }
//     console.log(metaResponse, "metaObj");
//     return { data, metaResponse };
//   } catch (error) {
//     return null;
//   }
// };

export const getGameBySlug = async (slug: string | undefined) => {
  const token = getToken();
  if (slug === undefined) {
    return null;
  }
  try {
    const { data } = await axios.get(
      `${getApi()}/games?filters[slug][$eq]=${slug}&populate=releaseByPlatforms.release.device.icon.url&populate=releaseByPlatforms.release.device.icon.alt&populate=releaseByPlatforms.release.device.logo.url&populate=releaseByPlatforms.release.device.logo.alt&populate=image&populate=coverImage&populate=screenshots&populate=categories&populate=devices.icon.image&populate=devices.icon.alt&populate=devices.logo.image&populate=devices.logo.alt&populate=developer&populate=publisher&populate=links&populate=stores&populate=related_games.image&populate=related_games.coverImage&populate=related_games.devices.icon.url&populate=related_games.devices.icon.alt&populate=related_games.devices.logo.url&populate=related_games.devices.logo.alt&populate=related_games.releaseByPlatforms.release.device&populate=game_preview.preview&populate=expansions.image&populate=expansions.coverImage&populate=expansions.devices.icon.url&populate=expansions.devices.icon.alt&populate=expansions.devices.logo.url&populate=expansions.devices.logo.alt&populate=seasons.image&populate=seasons.coverImage&populate=seasons.devices.icon.url&populate=seasons.devices.icon.alt&populate=seasons.devices.logo.url&populate=seasons.devices.logo.alt`,
      {
        headers: {
          Authorization: token && `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const getGameBySlugForRating = async (slug: string | undefined) => {
  const token = getToken();
  if (slug === undefined) {
    return null;
  }
  try {
    const { data } = await axios.get(
      `${getApi()}/games?filters[slug][$eq]=${slug}`,
      {
        headers: {
          Authorization: token && `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return null;
  }
};
