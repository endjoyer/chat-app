import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux.ts';
import { useGreenApi } from './useGreenApi.ts';
import {
  updateChatFromNotification,
  setLastNotificationId,
} from '../store/slices/chatSlice.ts';

const NOTIFICATION_INTERVAL = 5000;

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const lastNotificationId = useAppSelector(
    (state) => state.chat.lastNotificationId
  );

  const receiveNotification = useCallback(async () => {
    if (!api) return;

    try {
      const notification = await api.receiveNotification();

      if (notification) {
        const { receiptId, body } = notification;

        if (body.typeWebhook === 'incomingMessageReceived') {
          dispatch(updateChatFromNotification(notification));
        }

        await api.deleteNotification(receiptId);
        dispatch(setLastNotificationId(receiptId));
      }
    } catch (error) {
      console.error('Failed to receive notification:', error);
    }
  }, [api, dispatch]);

  useEffect(() => {
    const interval = setInterval(receiveNotification, NOTIFICATION_INTERVAL);
    return () => clearInterval(interval);
  }, [receiveNotification]);
};
