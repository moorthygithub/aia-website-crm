import BASE_URL from "@/config/base-url";
import appLogout from "@/utils/logout";
import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      appLogout();

      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
