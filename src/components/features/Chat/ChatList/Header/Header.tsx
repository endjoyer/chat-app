import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux.ts';
import {
  setCredentials,
  setAuthorized,
} from '../../../../../store/slices/authSlice.ts';
import { Button } from '../../../../common/Button/Button.tsx';
import { PersonIcon } from '../../../../common/Icons/PersonIcon.tsx';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { credentials } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(setCredentials(null));
    dispatch(setAuthorized(false));
    localStorage.removeItem('whatsapp_credentials');
  };

  return (
    <div className={styles.header}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <PersonIcon />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>
            ID: {credentials?.idInstance.slice(0, 8)}...
          </div>
          <div className={styles.status}>Online</div>
        </div>
      </div>
      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
