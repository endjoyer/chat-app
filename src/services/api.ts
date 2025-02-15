import axios from 'axios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createApi = (idInstance: string, apiTokenInstance: string) => {
  const baseURL = `https://1103.api.green-api.com/waInstance${idInstance}`;
  let lastRequestTime = 0;
  const MIN_REQUEST_INTERVAL = 1000;

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
    return request();
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

    getChats: async () => {
      return throttledRequest(() =>
        api.get(`/getChats/${apiTokenInstance}`)
      ).then((response) => response.data);
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
