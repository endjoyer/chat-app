import React, { useState } from 'react';
import { useAppSelector } from '../../../../hooks/redux.ts';
import { ChatList } from '../ChatList/ChatList.tsx';
import { ChatWindow } from '../ChatWindow/ChatWindow.tsx';
import { WhatsAppLogo } from '../../../common/Icons/WhatsAppLogo.tsx';
import { ChevronRight, ChevronLeft } from '../../../common/Icons/Arrow.tsx';
import styles from './ChatLayout.module.scss';
import { useNotifications } from '../../../../hooks/useNotifications.ts';

export const ChatLayout: React.FC = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const { currentChat } = useAppSelector((state) => state.chat);
  useNotifications();

  return (
    <div className={styles.layout}>
      <button
        className={`${styles.toggleSidebar} ${
          isSidebarHidden ? styles.hidden : ''
        }`}
        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
        aria-label={isSidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
      >
        {isSidebarHidden ? (
          <ChevronRight
            width="20px"
            height="20px"
            style={{ color: '#000000' }}
          />
        ) : (
          <ChevronLeft
            width="20px"
            height="20px"
            style={{ color: '#000000' }}
          />
        )}
      </button>

      <div
        className={`${styles.sidebar} ${isSidebarHidden ? styles.hidden : ''}`}
      >
        <ChatList />
      </div>

      <div
        className={`${styles.main} ${isSidebarHidden ? styles.expanded : ''}`}
      >
        {currentChat ? (
          <ChatWindow />
        ) : (
          <div className={styles.placeholder}>
            <WhatsAppLogo className={styles.logo} />
            <h2>WhatsApp Web</h2>
            <p>
              Send and receive messages without keeping your phone online. Use
              WhatsApp on up to 4 linked devices and 1 phone at the same time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
