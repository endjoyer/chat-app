import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux.ts';
import { useGreenApi } from './useGreenApi.ts';
import {
  setMessages,
  addMessage,
  setError,
} from '../store/slices/chatSlice.ts';
import { Message } from '../types/index.ts';
import { storage } from '../utils/storage.ts';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const { currentChat, messages } = useAppSelector((state) => state.chat);
  const lastMessageTimestamp = useRef<number>(0);

  const loadMessages = useCallback(async () => {
    if (!api || !currentChat) return;

    try {
      const cachedMessages = storage.getMessages(currentChat.id);
      if (cachedMessages.length > 0) {
        lastMessageTimestamp.current =
          cachedMessages[cachedMessages.length - 1].timestamp;
        dispatch(setMessages(cachedMessages));
      }

      const response = await api.getChatHistory(currentChat.id);
      const newMessages: Message[] = response
        .map((msg: any) => ({
          id: msg.idMessage,
          text:
            msg.messageData?.textMessageData?.textMessage ||
            msg.textMessage ||
            '',
          timestamp: msg.timestamp * 1000,
          fromMe: msg.type === 'outgoing',
        }))
        .filter(
          (msg: Message) =>
            msg.text && msg.timestamp > lastMessageTimestamp.current
        )
        .sort((a: Message, b: Message) => a.timestamp - b.timestamp);

      if (newMessages.length > 0) {
        const updatedMessages = [...messages, ...newMessages];
        dispatch(setMessages(updatedMessages));
        lastMessageTimestamp.current =
          newMessages[newMessages.length - 1].timestamp;
      }
    } catch (error) {
      dispatch(setError('Failed to load messages'));
    }
  }, [api, currentChat, dispatch]);

  useEffect(() => {
    if (currentChat) {
      lastMessageTimestamp.current = 0;
      loadMessages();
    }
  }, [currentChat?.id, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!api || !currentChat) return false;

      try {
        const response = await api.sendMessage(currentChat.id, text);
        const newMessage: Message = {
          id: response.idMessage,
          text,
          timestamp: Date.now(),
          fromMe: true,
        };
        dispatch(addMessage(newMessage));
        lastMessageTimestamp.current = newMessage.timestamp;
        return true;
      } catch (error) {
        dispatch(setError('Failed to send message'));
        return false;
      }
    },
    [api, currentChat, dispatch]
  );

  return { sendMessage };
};
