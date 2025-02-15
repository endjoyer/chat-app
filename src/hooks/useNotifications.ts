import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch } from './redux.ts';
import { useGreenApi } from './useGreenApi.ts';
import {
  updateChatFromNotification,
  setLastNotificationId,
} from '../store/slices/chatSlice.ts';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const processedNotifications = useRef<Set<number>>(new Set());

  const receiveNotification = useCallback(async () => {
    if (!api) return;

    try {
      const notification = await api.receiveNotification();

      if (notification) {
        const { receiptId } = notification;

        if (!processedNotifications.current.has(receiptId)) {
          if (
            notification.body.typeWebhook === 'incomingMessageReceived' &&
            notification.body.messageData?.textMessageData
          ) {
            dispatch(updateChatFromNotification(notification));
            processedNotifications.current.add(receiptId);
          }

          dispatch(setLastNotificationId(receiptId));
          await api.deleteNotification(receiptId);
        }
      }
    } catch (error) {
      console.error('Failed to receive notification:', error);
    }
  }, [api, dispatch]);

  useEffect(() => {
    if (api) {
      const interval = setInterval(receiveNotification, 5000);
      return () => clearInterval(interval);
    }
  }, [api, receiveNotification]);
};
