import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux.ts';
import { useGreenApi } from '../../../../hooks/useGreenApi.ts';
import {
  setChats,
  setCurrentChat,
  setLoading,
  setError,
} from '../../../../store/slices/chatSlice.ts';
import { Button } from '../../../common/Button/Button.tsx';
import { Input } from '../../../common/Input/Input.tsx';
import { PersonIcon } from '../../../common/Icons/PersonIcon.tsx';
import styles from './ChatList.module.scss';
import { Header } from './Header/Header.tsx';
import { ApiChat, Chat } from '../../../../types/index.ts';
import { delay } from '../../../../utils/delay.ts';
import { storage } from '../../../../utils/storage.ts';

export const ChatList: React.FC = () => {
  const [newChatPhone, setNewChatPhone] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  const dispatch = useAppDispatch();
  const api = useGreenApi();
  const { chats, currentChat, isLoading } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    const loadChats = async () => {
      if (!api) return;

      const cachedChats = storage.getChats();
      if (cachedChats.length > 0) {
        dispatch(setChats(cachedChats));
        return;
      }
      dispatch(setLoading(true));
      try {
        const response = await api.getChats();
        const formattedChats: Chat[] = response.map((chat: ApiChat) => ({
          id: chat.id.replace('@c.us', ''),
          name: chat.name || chat.id.replace('@c.us', ''),
          lastMessage: '',
          timestamp: Date.now(),
          unread: false,
        }));
        for (const chat of formattedChats.slice(0, 5)) {
          try {
            const history = await api.getChatHistory(chat.id);
            if (history && history.length > 0) {
              const lastMessage = history[0];
              const chatIndex = formattedChats.findIndex(
                (c) => c.id === chat.id
              );
              if (chatIndex !== -1) {
                formattedChats[chatIndex] = {
                  ...formattedChats[chatIndex],
                  lastMessage:
                    lastMessage?.messageData?.textMessageData?.textMessage ||
                    lastMessage?.textMessage ||
                    '',
                  timestamp: lastMessage
                    ? lastMessage.timestamp * 1000
                    : formattedChats[chatIndex].timestamp,
                };
              }
              await delay(2000);
            }
          } catch (error) {
            console.error(`Failed to load history for chat ${chat.id}:`, error);
          }
        }

        dispatch(setChats(formattedChats));
        storage.saveChats(formattedChats);
      } catch (error) {
        dispatch(setError('Failed to load chats'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadChats();
  }, [api, dispatch]);

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!api || !newChatPhone.trim()) return;

    dispatch(setLoading(true));
    try {
      await api.sendMessage(newChatPhone, '👋 Hello!');

      const newChat: Chat = {
        id: newChatPhone,
        name: newChatPhone,
        lastMessage: '👋 Hello!',
        timestamp: Date.now(),
        unread: false,
      };

      const updatedChats = [...chats, newChat];
      dispatch(setChats(updatedChats));
      dispatch(setCurrentChat(newChat));
      storage.saveChats(updatedChats);

      setNewChatPhone('');
      setShowNewChat(false);
    } catch (error) {
      dispatch(setError('Failed to create new chat'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.chatList}>
      <Header />
      <div className={styles.header}>
        <h2>Chats</h2>
        <Button
          variant="secondary"
          onClick={() => setShowNewChat(!showNewChat)}
        >
          New Chat
        </Button>
      </div>

      {showNewChat && (
        <div className={styles.newChatForm}>
          <form onSubmit={handleStartNewChat}>
            <Input
              type="text"
              value={newChatPhone}
              onChange={(e) => setNewChatPhone(e.target.value)}
              placeholder="Enter phone number"
              pattern="[0-9]+"
              title="Please enter only numbers"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Start
            </Button>
          </form>
        </div>
      )}

      <div className={styles.list}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${
              currentChat?.id === chat.id ? styles.active : ''
            } ${chat.unread ? styles.unread : ''}`}
            onClick={() => dispatch(setCurrentChat(chat))}
          >
            <div className={styles.avatar}>
              <PersonIcon />
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.chatHeader}>
                <span className={styles.chatName}>{chat.name}</span>
                <span className={styles.timestamp}>
                  {formatTime(chat.timestamp)}
                </span>
              </div>
              {chat.lastMessage && (
                <div className={styles.lastMessage}>{chat.lastMessage}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
