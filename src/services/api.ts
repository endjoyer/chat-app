import axios, { AxiosError } from 'axios';
import { delay } from '../utils/delay.ts';
import { ApiChat } from '../types/index.ts';

export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createApi = (idInstance: string, apiTokenInstance: string) => {
  const baseURL = `https://1103.api.green-api.com/waInstance${idInstance}`;
  let lastRequestTime = 0;
  const MIN_REQUEST_INTERVAL = 2000;

  const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 429) {
        throw new ApiError(
          'Too many requests. Please try again later.',
          429,
          'RATE_LIMIT'
        );
      }
      throw new ApiError(error.message, error.response?.status, error.code);
    }
  );

  const throttledRequest = async (request: () => Promise<any>) => {
    const now = Date.now();
    const timeToWait = Math.max(
      0,
      MIN_REQUEST_INTERVAL - (now - lastRequestTime)
    );

    if (timeToWait > 0) {
      await delay(timeToWait);
    }

    lastRequestTime = Date.now();
    try {
      return await request();
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        await delay(5000);
        return request();
      }
      throw error;
    }
  };

  return {
    sendMessage: async (chatId: string, message: string) => {
      return throttledRequest(() =>
        api.post(`/sendMessage/${apiTokenInstance}`, {
          chatId: `${chatId}@c.us`,
          message,
        })
      ).then((response) => response.data);
    },

    getChats: async (): Promise<ApiChat[]> => {
      const response = await api.get(`/getChats/${apiTokenInstance}`);
      return response.data;
    },

    getChatHistory: async (chatId: string) => {
      return throttledRequest(() =>
        api.post(`/getChatHistory/${apiTokenInstance}`, {
          chatId: `${chatId}@c.us`,
          count: 100,
        })
      ).then((response) => response.data);
    },

    checkAuth: async () => {
      return throttledRequest(() =>
        api.get(`/getStateInstance/${apiTokenInstance}`)
      ).then((response) => response.data.stateInstance === 'authorized');
    },

    receiveNotification: async () => {
      return throttledRequest(() =>
        api.get(`/receiveNotification/${apiTokenInstance}`)
      ).then((response) => response.data);
    },

    deleteNotification: async (receiptId: number) => {
      return throttledRequest(() =>
        api.delete(`/deleteNotification/${apiTokenInstance}/${receiptId}`)
      ).then((response) => response.data);
    },
  };
};

export type GreenApi = ReturnType<typeof createApi>;
