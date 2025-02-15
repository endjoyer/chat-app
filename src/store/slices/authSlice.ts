import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthCredentials } from '../../types/index.ts';

interface AuthState {
  credentials: AuthCredentials | null;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
}

const getStoredCredentials = (): AuthCredentials | null => {
  const stored = localStorage.getItem('whatsapp_credentials');
  return stored ? JSON.parse(stored) : null;
};

const initialState: AuthState = {
  credentials: getStoredCredentials(),
  isAuthorized: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthCredentials | null>) => {
      state.credentials = action.payload;
      if (action.payload) {
        localStorage.setItem(
          'whatsapp_credentials',
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem('whatsapp_credentials');
      }
    },
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setAuthorized, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
