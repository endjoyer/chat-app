import { Chat, Message } from '../types';

const CHATS_KEY = 'whatsapp_chats';
const MESSAGES_PREFIX = 'whatsapp_messages_';

export const storage = {
  saveChats: (chats: Chat[]) => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  getChats: (): Chat[] => {
    const saved = localStorage.getItem(CHATS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveMessages: (chatId: string, messages: Message[]) => {
    localStorage.setItem(MESSAGES_PREFIX + chatId, JSON.stringify(messages));
  },

  getMessages: (chatId: string): Message[] => {
    const saved = localStorage.getItem(MESSAGES_PREFIX + chatId);
    return saved ? JSON.parse(saved) : [];
  },

  clearAll: () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('whatsapp_')) {
        localStorage.removeItem(key);
      }
    });
  },
};
