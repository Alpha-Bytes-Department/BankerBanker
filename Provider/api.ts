import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Declaration section
let isRefreshing = false;
let waitingQueue: ((token: string) => void)[] = [];
// Declaring public routes
const publicEndPoint = ["/singup"];

// Function to get tokens from localStorage
const getTokensFromLocalStorage = () => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    accessToken: userData?.access_token || null,
    refreshToken: userData?.refresh_token || null,
  };
};

// Creating axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://10.10.12.95:8000",
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
    const isPublic = publicEndPoint.some((url) =>
      config.url?.includes(url)
    );
    if (accessToken && !isPublic) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(`Error in request: ${error}`)
);

// Handle token expiration automatically
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry: boolean };

    // Wait until original request completes
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queuingFailedRoute((token) => {
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
          return null;
        }

        const { data } = await api.post<{ access_token: string }>(
          "/accounts/token/refresh/",
          { refresh_token: refreshToken }
        );
        const newToken = data.access_token;

        // Update localStorage with new access token
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...userData, access_token: newToken }));
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        executingRoutes(newToken);
        return api(originalRequest);
      } catch (refreshError) {
        window.localStorage.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Function to set access token in localStorage
export const setAccessToken = (token: string | null): void => {
  if (token) {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...userData, access_token: token }));
  }
};

// Optionally expose getter for debugging
export const getAccessToken = (): string | null => {
  const { accessToken } = getTokensFromLocalStorage();
  return accessToken;
};

export default api;