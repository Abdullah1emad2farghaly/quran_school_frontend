import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.your-domain.com/v1";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to every request, if present.
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error shape so UI code can rely on `error.message` and `error.status`.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    if (status === 401) {
      localStorage.removeItem("auth_token");
      // A real app would redirect to /login here.
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default httpClient;
