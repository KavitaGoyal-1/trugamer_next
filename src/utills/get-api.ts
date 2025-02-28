export const getApi = (): string => {
  let api = process.env.NEXT_PUBLIC_URL || "";
  return api;
};

export const getApiKey = (): string => {
  let key = process.env.NEXT_API_AUTH_KEY || "";
  return key;
};

export const getImageUrl = (): string => {
  let url = process.env.NEXT_API_ENDPOINT_IMAGES || "";
  return url;
};
