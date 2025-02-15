import React from 'react';
import { ArrowDown } from '../../../common/Icons/Arrow.tsx';
import styles from './ChatWindow.module.scss';

interface Props {
  count: number;
  onClick: () => void;
}

export const NewMessageIndicator: React.FC<Props> = ({ count, onClick }) => {
  if (count === 0) return null;

  return (
    <div className={styles.unreadBadge} onClick={onClick}>
      <ArrowDown />
      {count} new message{count > 1 ? 's' : ''}
    </div>
  );
};
