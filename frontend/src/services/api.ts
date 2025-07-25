import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiResponse, CreateSessionResponse, SessionStatus } from "../types";

const API_BASE_URL = "http://localhost:8080";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.message === "Network Error" &&
      originalRequest &&
      !originalRequest.headers._retryCount
    ) {
      originalRequest.headers._retryCount = originalRequest.headers._retryCount
        ? originalRequest.headers._retryCount + 1
        : 1;

      if (originalRequest.headers._retryCount <= 3) {
        const delay =
          Math.pow(2, originalRequest.headers._retryCount - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export const sessionService = {
  createSession: async (): Promise<ApiResponse<CreateSessionResponse>> => {
    try {
      const response = await apiClient.get<CreateSessionResponse>(
        "/launchInstance"
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: {} as CreateSessionResponse,
          message: error.response?.data?.message || "Failed to create session",
        };
      }
      return {
        status: 500,
        data: {} as CreateSessionResponse,
        message: "An unexpected error occurred",
      };
    }
  },

  terminateSession: async (publicIp: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete(`/deleteInstance`, {
        data: { publicIp },
      });
      return {
        status: response.status,
        data: null,
        message: "Session terminated successfully",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: null,
          message:
            error.response?.data?.message || "Failed to terminate session",
        };
      }
      return {
        status: 500,
        data: null,
        message: "An unexpected error occurred",
      };
    }
  },

  checkSessionStatus: async (
    sessionId: string
  ): Promise<ApiResponse<SessionStatus>> => {
    try {
      const response = await apiClient.get<SessionStatus>(
        `/status/${sessionId}`
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          data: {} as SessionStatus,
          message:
            error.response?.data?.message || "Failed to check session status",
        };
      }
      return {
        status: 500,
        data: {} as SessionStatus,
        message: "An unexpected error occurred",
      };
    }
  },
};
