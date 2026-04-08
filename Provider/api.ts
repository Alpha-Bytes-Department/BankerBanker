import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Declaration section
let isRefreshing = false;
let waitingQueue: ((token: string) => void)[] = [];
// Endpoints that must never send bearer tokens and must not trigger refresh logic.
const authBootstrapEndpoints = [
  "/api/accounts/login/",
  "/api/accounts/signup/",
  "/api/accounts/resend-otp/",
  "/api/accounts/verify-otp/",
  "/api/accounts/forgot-password/",
  "/api/accounts/forgot-password/verify-otp/",
  "/accounts/token/refresh/",
];

const isPublicEndpoint = (url?: string) =>
  authBootstrapEndpoints.some((endpoint) => url?.includes(endpoint));

// Function to get tokens from localStorage
const getTokensFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  try {
    const userCredentials = localStorage.getItem("userCredentials");
    if (userCredentials) {
      const { access_token, refresh_token } = JSON.parse(userCredentials);
      return { accessToken: access_token, refreshToken: refresh_token };
    }
    return { accessToken: null, refreshToken: null };
  } catch (error) {
    console.error("Failed to read tokens from localStorage", error);
    return { accessToken: null, refreshToken: null };
  }


};
console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

// Creating axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/",
  withCredentials: true,
});

// Function to queue failed route callbacks
const queuingFailedRoute = (callback: (token: string) => void) => {
  waitingQueue.push(callback);
};

// Function to execute queued routes
const executingRoutes = (token: string) => {
  waitingQueue.forEach((callback) => callback(token));
  waitingQueue = [];
};

// Attaching token in header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { accessToken } = getTokensFromLocalStorage();

    if (isPublicEndpoint(config.url)) {
      delete config.headers.Authorization;
      return config;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(`Error in request: ${error}`),
);

// Handle token expiration automatically
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    // Wait until original request completes
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isPublicEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queuingFailedRoute((token) => {
            if (!token) return reject("Refresh failed");
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = getTokensFromLocalStorage();
        if (!refreshToken) {
          window.location.replace("/signin");
          return Promise.reject("No refresh token");
        }

        const { data } = await api.post<{ access_token: string }>(
          "/accounts/token/refresh/",
          { refresh_token: refreshToken },
        );
        const newToken = data.access_token;

        // Update localStorage with new access token
        const userData = JSON.parse(localStorage.getItem("userCredentials") || "{}");
        localStorage.setItem(
          "userCredentials",
          JSON.stringify({ ...userData, access_token: newToken }),
        );
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        executingRoutes(newToken);
        return api(originalRequest);
      } catch (refreshError) {
        window.location.replace("/signin");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Function to set access token in localStorage
export const setAccessToken = (token: string | null): void => {
  if (token) {
    const userData = JSON.parse(localStorage.getItem("userCredentials") || "{}");
    localStorage.setItem(
      "userCredentials",
      JSON.stringify({ ...userData, access_token: token }),
    );
  }
};

// Optionally expose getter for debugging
export const getAccessToken = (): string | null => {
  const { accessToken } = getTokensFromLocalStorage();
  return accessToken;
};

export default api;
