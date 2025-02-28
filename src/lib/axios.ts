import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://some-domain.com/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export default axiosInstance;
