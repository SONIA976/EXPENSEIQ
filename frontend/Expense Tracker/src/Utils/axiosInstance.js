import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Don't override Content-Type for multipart uploads
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Simple retry helper for transient network issues
async function withRetry(requestFn, retries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      lastErr = err;
      const isNetwork = !err.response;
      const isTimeout = err.code === "ECONNABORTED";
      if (!(isNetwork || isTimeout) || attempt === retries) break;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Retry once for network errors
      try {
        return await withRetry(() => axiosInstance.request(error.config), 1);
      } catch (_) {
        // fallthrough
      }
    }

    if (error.response?.status === 401) {
      // Clear token only if we are not already on login
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;