import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG, AUTH_ENDPOINTS } from "../config/api";
import { emit } from "../auth/events";

export const createAxiosInstance = (opts?: {
  cookie?: string;
}): AxiosInstance => {
  let isRefreshing = false;
  let refreshePromise: Promise<string> | null = null;

  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      ...API_CONFIG.headers,
      ...(opts?.cookie ? { cookie: opts.cookie } : {}),
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        !error.response ||
        error.response.status !== 401 ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      if (isRefreshing && refreshePromise) {
        try {
          await refreshePromise;
          return instance.request(originalRequest);
        } catch (error) {
          if (typeof window !== "undefined")
            window.location.assign("/auth/login");
          return Promise.reject(error);
        }
      }
      isRefreshing = true;
      refreshePromise = instance.post(AUTH_ENDPOINTS.refreshToken, undefined, {
        withCredentials: true,
      });
      try {
        await refreshePromise;
        emit("token:refreshed");
        return instance.request(originalRequest);
      } catch (error) {
        if (typeof window !== "undefined")
          window.location.assign("/auth/login");
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        refreshePromise = null;
      }
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await axiosInstance.get(url, config);
    return res.data;
  },

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return res.data;
  },

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return res.data;
  },

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return res.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return res.data;
  },

  async uploadFile<T>(
    url: string,
    file: File,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const form = new FormData();
    form.append("file", file);
    const res: AxiosResponse<T> = await axiosInstance.post(url, form, {
      ...config,
    });
    return res.data;
  },
};

export const createServerApi = (cookieHeader: string) => {
  const inst = createAxiosInstance({ cookie: cookieHeader });
  return {
    get: async <T>(url: string, cfg?: AxiosRequestConfig) =>
      (await inst.get<T>(url, cfg)).data,
    post: async <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) =>
      (await inst.post<T>(url, data, cfg)).data,
    patch: async <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) =>
      (await inst.patch<T>(url, data, cfg)).data,
    delete: async <T>(url: string, cfg?: AxiosRequestConfig) =>
      (await inst.delete<T>(url, cfg)).data,
  };
};
