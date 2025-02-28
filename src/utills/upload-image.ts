import axios from "axios";
import { toastMessage } from "./toast";
import { getApi } from "./get-api";

export const uploadImage = async (imageFile: any, token: string) => {
  const formData = new FormData();
  formData.append("files", imageFile);
  const allowedTypes = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  if (!allowedTypes.includes(imageFile.type)) {
    toastMessage("error", "Only SVG, PNG, JPG, and GIF files are allowed.");
    return {
      status: 400, // Return a status to indicate bad request due to invalid file type
      response: null,
    };
  }
  try {
    const response = await axios.post(`${getApi()}/upload/`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: 200,
      response,
    };
  } catch (error: any) {
    return {
      status: 500,
    };
  }
};
