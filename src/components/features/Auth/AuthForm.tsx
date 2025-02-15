import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux.ts';
import {
  setCredentials,
  setAuthorized,
  setError,
} from '../../../store/slices/authSlice.ts';
import { createApi } from '../../../services/api.ts';
import { Button } from '../../common/Button/Button.tsx';
import { Input } from '../../common/Input/Input.tsx';
import { WhatsAppLogo } from '../../common/Icons/WhatsAppLogo.tsx';
import styles from './AuthForm.module.scss';

export const AuthForm: React.FC = () => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, isAuthorized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthorized) {
      navigate('/chats');
    }
  }, [isAuthorized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) return;

    setIsLoading(true);
    dispatch(setError(null));

    try {
      const api = createApi(idInstance, apiTokenInstance);
      const isAuthorized = await api.checkAuth();

      if (isAuthorized) {
        dispatch(setCredentials({ idInstance, apiTokenInstance }));
        dispatch(setAuthorized(true));
        navigate('/chats');
      } else {
        dispatch(
          setError('Authorization failed. Please check your credentials.')
        );
      }
    } catch (err) {
      dispatch(setError('Failed to connect to WhatsApp. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authForm}>
      <WhatsAppLogo className={styles.logo} />
      <h1 className={styles.title}>Connect to WhatsApp</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="text"
          placeholder="ID Instance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          type="password"
          placeholder="API Token"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          disabled={isLoading}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect'}
        </Button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.helpText}>
          Need credentials?{' '}
          <a
            href="https://green-api.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get them on Green API
          </a>
        </div>
      </form>
    </div>
  );
};
