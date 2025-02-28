import { IConfig } from "./types";

const config: IConfig = {
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "",
  NEXT_API_ENDPOINT: process.env.NEXT_API_ENDPOINT || "",
  NEXT_SITE_URL: process.env.NEXT_SITE_URL || "",
  NEXT_API_AUTH_KEY: process.env.NEXT_API_AUTH_KEY || "",
  NEXT_GOOGLE_AUTH_USER_DATA: process.env.NEXT_GOOGLE_AUTH_USER_DATA || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  NEXT_GOOGLE_AUTH_ENDPOINT: process.env.NEXT_GOOGLE_AUTH_ENDPOINT || "",
};

export default config;
