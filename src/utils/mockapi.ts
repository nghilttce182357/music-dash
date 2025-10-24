/**
 * MockAPI Login
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

interface AuthResponse {
  token: string;
}

const MOCK_API_URL = process.env.NEXT_PUBLIC_MOCK_API_URL;
const MOCK_API_URL_LOGIN = process.env.NEXT_PUBLIC_MOCK_API_URL_LOGIN;

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: MOCK_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mockapi_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 unauthorized
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const username = prompt("Username (MockAPI):");
        if (!username) throw new Error("Username required.");

        const password = prompt("Password (MockAPI):");
        if (!password) throw new Error("Password required.");

        const loginResponse = await loginAPI(username, password);
        const { token } = loginResponse.data;

        localStorage.setItem("mockapi_token", token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (loginError) {
        alert("Unable to log in. Please verify your MockAPI username and password.");
        localStorage.removeItem("mockapi_token");
        location.reload();
        return Promise.reject(loginError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Login API call
 */
function loginAPI(
  username: string,
  password: string
): Promise<AxiosResponse<AuthResponse>> {
  return axios.post<AuthResponse>(
    `${MOCK_API_URL}${MOCK_API_URL_LOGIN}`,
    { username, password },
    {
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export default axiosInstance;