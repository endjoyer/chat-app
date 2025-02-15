import axios from 'axios';

export const createApi = (idInstance: string, apiTokenInstance: string) => {
  const baseURL = `https://1103.api.green-api.com/waInstance${idInstance}`;

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    sendMessage: async (chatId: string, message: string) => {
      const response = await api.post(`/sendMessage/${apiTokenInstance}`, {
        chatId: `${chatId}@c.us`,
        message,
      });
      return response.data;
    },

    getChats: async () => {
      const response = await api.get(`/getChats/${apiTokenInstance}`);
      return response.data;
    },

    getChatHistory: async (chatId: string) => {
      const response = await api.post(`/getChatHistory/${apiTokenInstance}`, {
        chatId: `${chatId}@c.us`,
        count: 100,
      });
      return response.data;
    },

    checkAuth: async () => {
      const response = await api.get(`/getStateInstance/${apiTokenInstance}`);
      return response.data.stateInstance === 'authorized';
    },
    receiveNotification: async () => {
      const response = await api.get(
        `/receiveNotification/${apiTokenInstance}`
      );
      return response.data;
    },

    deleteNotification: async (receiptId: number) => {
      const response = await api.delete(
        `/deleteNotification/${apiTokenInstance}/${receiptId}`
      );
      return response.data;
    },
  };
};

export type GreenApi = ReturnType<typeof createApi>;
