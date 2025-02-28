import Cookies from "js-cookie";

// Get token (Client Side)
export const getToken = (): string | undefined => {
  return Cookies.get("JWT");
};

// Clear token (Client Side)
export const clearToken = (): void => {
  Cookies.remove("JWT");
};
