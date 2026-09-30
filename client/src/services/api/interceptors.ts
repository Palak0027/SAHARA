import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Attach JWT Bearer token from localStorage
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ensure Content-Type default
  if (config.headers && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (import.meta.env.DEV) {
    console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
  }

  return config;
};

export const requestErrorInterceptor = (error: AxiosError): Promise<never> => {
  return Promise.reject(error);
};

export const responseInterceptor = (response: AxiosResponse): any => {
  if (import.meta.env.DEV) {
    console.debug(`[API Response] ${response.status} ${response.config.url}`, response.data);
  }

  return response;
};

export const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
  const status = error.response?.status;
  const rawData: any = error.response?.data;
  const rawMessage = rawData?.message || error.message || '';

  if (import.meta.env.DEV) {
    console.error(`[API Error] ${status || 'Network'} ${error.config?.url}:`, {
      message: rawMessage,
      data: rawData,
    });
  }

  // Handle 401 Unauthorized (Expired or Invalid Token)
  if (status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    const requestUrl = error.config?.url || '';
    const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
    const isLoginPage = window.location.pathname === '/login';

    if (!isLoginPage && !isAuthRoute) {
      window.location.href = '/login';
    }
  }

  // Translate technical errors into user-friendly message
  const friendlyMessage = getFriendlyErrorMessage(rawMessage);

  const customError: any = new Error(friendlyMessage);
  customError.statusCode = status;
  customError.rawMessage = rawMessage;
  customError.errors = rawData?.errors;
  customError.originalError = error;

  return Promise.reject(customError);
};
