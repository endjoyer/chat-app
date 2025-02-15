import { useMemo } from 'react';
import { useAppSelector } from './redux.ts';
import { createApi, GreenApi } from '../services/api.ts';

export const useGreenApi = (): GreenApi | null => {
  const { credentials } = useAppSelector((state) => state.auth);

  const api = useMemo(() => {
    if (!credentials) return null;
    return createApi(credentials.idInstance, credentials.apiTokenInstance);
  }, [credentials]);

  return api;
};
