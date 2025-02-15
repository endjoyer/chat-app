import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message, Notification } from '../../types/index.ts';
import { storage } from '../../utils/storage.ts';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  lastNotificationId: number | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
  lastNotificationId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
      state.error = null;
      storage.saveChats(action.payload);
    },

    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
      if (action.payload) {
        state.messages = storage.getMessages(action.payload.id);
      } else {
        state.messages = [];
      }
    },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      if (state.currentChat) {
        storage.saveMessages(state.currentChat.id, action.payload);
      }
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);

      if (state.currentChat) {
        storage.saveMessages(state.currentChat.id, state.messages);

        const chatIndex = state.chats.findIndex(
          (chat) => chat.id === state.currentChat!.id
        );

        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: action.payload.text,
            timestamp: action.payload.timestamp,
            unread: !action.payload.fromMe,
          };
          storage.saveChats(state.chats);
        }
      }
    },
    updateChatFromNotification: (
      state,
      action: PayloadAction<Notification>
    ) => {
      const { body } = action.payload;
      const chatId = body.senderData.chatId.replace('@c.us', '');

      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          lastMessage: body.messageData.textMessageData?.textMessage || '',
          timestamp: body.timestamp * 1000,
          unread: true,
        };
      } else {
        state.chats.push({
          id: chatId,
          name: body.senderData.senderName || chatId,
          lastMessage: body.messageData.textMessageData?.textMessage || '',
          timestamp: body.timestamp * 1000,
          unread: true,
        });
      }

      if (state.currentChat?.id === chatId) {
        state.messages.push({
          id: body.idMessage,
          text: body.messageData.textMessageData?.textMessage || '',
          timestamp: body.timestamp * 1000,
          fromMe: false,
        });
      }
    },
    setLastNotificationId: (state, action: PayloadAction<number>) => {
      state.lastNotificationId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  setMessages,
  addMessage,
  updateChatFromNotification,
  setLastNotificationId,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
