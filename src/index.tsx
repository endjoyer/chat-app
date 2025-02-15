import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';
import { store } from './store/store.ts';
import './assets/styles/global.scss';

// const persistedState = localStorage.getItem('appState');
// const initialState = persistedState ? JSON.parse(persistedState) : undefined;

// const store = createStore(rootReducer, initialState);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
