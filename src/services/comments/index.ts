import axios from "axios";
import { getToken } from "@/utills/cookies";
import { getApi } from "@/utills/get-api";

interface Payload {
  author: {
    id: number;
    name: string;
    email: string;
  };
  content: string;
  threadOf?: number;
}

export const getNewsComments = async (newsId: number) => {
  let url = `${getApi()}/comments/api::report.report:${newsId}`;
  try {
    const data = (await axios.get(url)).data;
    return data;
  } catch (error) {
    return null;
  }
};

export const postCommentFn = async (
  payload: Payload,
  newsId: number,
  threadOf?: number
) => {
  const token = getToken();
  let dataToSend = { ...payload };
  if (threadOf) {
    dataToSend.threadOf = threadOf;
  }
  let url = `${getApi()}/comments/api::report.report:${newsId}`;

  try {
    const data = (
      await axios.post(url, dataToSend, {
        headers: {
          Authorization: token && `Bearer ${token}`,
        },
      })
    ).data;
    return data;
  } catch (error) {
    return null;
  }
};

export const deleteCommentFn = async (commentId: string) => {
  const token = getToken();
  let url = `${getApi()}/comments/moderate/single/${commentId}/block`;

  try {
    const data = (
      await axios.patch(url, {
        headers: {
          Authorization: token && `Bearer ${token}`,
        },
      })
    ).data;
    return data;
  } catch (error) {
    return null;
  }
};
