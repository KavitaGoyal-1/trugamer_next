import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";
import axios from "axios";

export const getNews = async (
  page: number = 1,
  pageSize: number = 9,
  sortBy?: string
) => {
  let url = `${getApi()}/news?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=news_tags.icon&populate=coverImage&populate=author&orderBy=latest${
    sortBy
      ? sortBy == "latest"
        ? "&sort[0]=updatedAt:desc"
        : "&sort[0]=updatedAt:asc"
      : "&sort[0]=updatedAt:desc"
  }${sortBy && sortBy == "trending" ? "&findBy=trending" : ""}`;

  try {
    const data = (await axios.get(url)).data;
    return data.result;
  } catch (error) {
    return null;
  }
};

export const getlatestNews = async (
  page: number = 1,
  pageSize: number = 9,
  sortBy?: string
) => {
  let url = `${getApi()}/news?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=news_tags.icon&populate=coverImage&populate=author&orderBy=latest${
    sortBy
      ? sortBy == "latest"
        ? "&sort[0]=updatedAt:desc"
        : "&sort[0]=updatedAt:asc"
      : "&sort[0]=updatedAt:desc"
  }${sortBy && sortBy == "trending" ? "&findBy=trending" : ""}`;

  try {
    const data = (await axios.get(url)).data;

    return data?.results?.length > 0
      ? data.results.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      : [];
  } catch (error) {
    return null;
  }
};

export const getSingleNews = async (slug: string) => {
  let url = `${getApi()}/news?filters[slug][$eq]=${slug}&populate=coverImage,related_game.image,related_game.coverImage,related_game.devices,news_tags.icon,author,news.coverImage,news.tags,news.author`;

  try {
    const data = (await axios.get(url)).data;
    return data?.results?.length > 0 ? data.results[0] : null;
  } catch (error) {
    return null;
  }
};

export const getTags = async () => {
  let url = `${getApi()}/news-tags`;
  try {
    const data = (await axios.get(url)).data;
    return data;
  } catch (error) {
    return null;
  }
};

export const postArticle = async (article: any) => {
  const token = getToken();
  let url = `${getApi()}/news`;
  try {
    const data = (
      await axios.post(url, article, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;

    return data;
  } catch (error) {
    return null;
  }
};

export const getFeaturedNews = async (
  page: number = 1,
  pageSize: number = 9,
  sortBy?: string
) => {
  let url = `${getApi()}/featured-article?populate=featured.coverImage,featured.author,featured.news_tags.icon,featured_1.coverImage,featured_1.author,featured_1.news_tags.icon,featured_2.coverImage,featured_2.author,featured_2.news_tags.icon }`;

  try {
    const data = (await axios.get(url)).data;
    return data;
  } catch (error) {
    return null;
  }
};
