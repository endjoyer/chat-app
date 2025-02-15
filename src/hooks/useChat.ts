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

const POLLING_INTERVAL = 15000;

export const useChat = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const { currentChat } = useAppSelector((state) => state.chat);
  const lastMessageTimestamp = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  const loadMessages = useCallback(async () => {
    if (!api || !currentChat) return;

    try {
      if (isFirstLoad.current) {
        const cachedMessages = storage.getMessages(currentChat.id);
        if (cachedMessages.length > 0) {
          dispatch(setMessages(cachedMessages));
          lastMessageTimestamp.current =
            cachedMessages[cachedMessages.length - 1].timestamp;
          isFirstLoad.current = false;
          return;
        }
      }

      const response = await api.getChatHistory(currentChat.id);
      const messages: Message[] = response
        .map((msg: any) => ({
          id: msg.idMessage,
          text:
            msg.textMessage ||
            msg.messageData?.textMessageData?.textMessage ||
            '',
          timestamp: msg.timestamp * 1000,
          fromMe: msg.type === 'outgoing',
        }))
        .filter(
          (msg: Message) =>
            msg.text && msg.timestamp > lastMessageTimestamp.current
        )
        .sort((a: Message, b: Message) => a.timestamp - b.timestamp);

      if (messages.length > 0) {
        if (isFirstLoad.current) {
          dispatch(setMessages(messages));
          isFirstLoad.current = false;
        } else {
          messages.forEach((msg) => dispatch(addMessage(msg)));
        }
        lastMessageTimestamp.current = messages[messages.length - 1].timestamp;
      }
    } catch (error) {
      dispatch(setError('Failed to load messages'));
    }
  }, [api, currentChat, dispatch]);

  useEffect(() => {
    if (currentChat) {
      lastMessageTimestamp.current = 0;
      isFirstLoad.current = true;
      loadMessages();
    }
  }, [currentChat?.id]);

  useEffect(() => {
    if (!currentChat) return;

    const interval = setInterval(loadMessages, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [currentChat, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!api || !currentChat) return;

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
