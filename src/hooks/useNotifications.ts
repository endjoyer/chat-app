import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux.ts';
import { useGreenApi } from './useGreenApi.ts';
import {
  updateChatFromNotification,
  setLastNotificationId,
} from '../store/slices/chatSlice.ts';

const POLLING_INTERVAL = 5000;

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const { lastNotificationId } = useAppSelector((state) => state.chat);
  const pollingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const receiveNotification = useCallback(async () => {
    if (!api) return;

    try {
      const notification = await api.receiveNotification();

      if (notification) {
        if (
          notification.body.typeWebhook === 'incomingMessageReceived' &&
          notification.body.messageData?.textMessageData
        ) {
          dispatch(updateChatFromNotification(notification));
        }

        dispatch(setLastNotificationId(notification.receiptId));
        await api.deleteNotification(notification.receiptId);
      }
    } catch (error) {
      console.error('Failed to receive notification:', error);
    }
  }, [api, dispatch]);

  useEffect(() => {
    if (api) {
      receiveNotification();
      pollingTimeoutRef.current = setInterval(
        receiveNotification,
        POLLING_INTERVAL
      );
    }

    return () => {
      if (pollingTimeoutRef.current) {
        clearInterval(pollingTimeoutRef.current);
      }
    };
  }, [api, receiveNotification]);
};
