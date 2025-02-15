import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../../../hooks/redux.ts';
import { useChat } from '../../../../hooks/useChat.ts';
import { Input } from '../../../common/Input/Input.tsx';
import { Button } from '../../../common/Button/Button.tsx';
import styles from './ChatWindow.module.scss';

export const ChatWindow: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { currentChat, messages } = useAppSelector((state) => state.chat);
  const { sendMessage } = useChat();

  const scrollToBottom = useCallback(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const success = await sendMessage(newMessage.trim());
    setIsLoading(false);

    if (success) {
      setNewMessage('');
      setAutoScroll(true);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!currentChat) {
    return (
      <div className={styles.chatWindow}>
        <div className={styles.placeholder}>
          <h3>Select a chat to start messaging</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3>{currentChat.name}</h3>
      </div>

      <div
        className={styles.messages}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.fromMe ? styles.sent : styles.received
            }`}
          >
            <div className={styles.message}>
              <div className={styles.messageText}>{message.text}</div>
              <div className={styles.messageTime}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};
