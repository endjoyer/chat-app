import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux.ts';
import { useGreenApi } from './useGreenApi.ts';
import {
  setMessages,
  addMessage,
  setError,
} from '../store/slices/chatSlice.ts';
import { Message } from '../types/index.ts';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const { currentChat } = useAppSelector((state) => state.chat);
  const pollingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const loadMessages = useCallback(async () => {
    if (!api || !currentChat) return;

    try {
      const response = await api.getChatHistory(currentChat.id);
      const messages: Message[] = response
        .map((msg: any) => ({
          id: msg.idMessage,
          text:
            msg.messageData?.textMessageData?.textMessage ||
            msg.textMessage ||
            '',
          timestamp: msg.timestamp * 1000,
          fromMe: msg.type === 'outgoing',
        }))
        .filter((msg: Message) => msg.text)
        .sort((a: Message, b: Message) => a.timestamp - b.timestamp);

      if (messages.length > 0) {
        dispatch(setMessages(messages));
      }
    } catch (error) {
      dispatch(setError('Failed to load messages'));
    }
  }, [api, currentChat, dispatch]);

  useEffect(() => {
    if (currentChat) {
      loadMessages();

      pollingTimeoutRef.current = setInterval(loadMessages, 10000);
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearInterval(pollingTimeoutRef.current);
      }
    };
  }, [currentChat?.id]);

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
