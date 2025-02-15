import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './hooks/redux.ts';
import { setCredentials, setAuthorized } from './store/slices/authSlice.ts';
import { createApi } from './services/api.ts';
import { AuthForm } from './components/features/Auth/AuthForm.tsx';
import { ChatLayout } from './components/features/Chat/ChatLayout/ChatLayout.tsx';
import { ProtectedRoute } from './components/common/ProtectedRoute/ProtectedRoute.tsx';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Проверяем сохраненные credentials при загрузке приложения
    const savedCredentials = localStorage.getItem('whatsapp_credentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      dispatch(setCredentials(credentials));

      // Проверяем валидность credentials
      const checkAuth = async () => {
        try {
          const api = createApi(
            credentials.idInstance,
            credentials.apiTokenInstance
          );
          const isAuthorized = await api.checkAuth();
          dispatch(setAuthorized(isAuthorized));
        } catch (error) {
          // Если проверка не удалась, очищаем credentials
          dispatch(setCredentials(null));
          dispatch(setAuthorized(false));
          localStorage.removeItem('whatsapp_credentials');
        }
      };

      checkAuth();
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chats" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
