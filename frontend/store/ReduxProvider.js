'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { fetchCurrentUser, setCredentials } from './authSlice';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem('byk_user') || localStorage.getItem('byk_user');
      const token = sessionStorage.getItem('byk_token') || localStorage.getItem('byk_token') || sessionStorage.getItem('token') || localStorage.getItem('token');
      const refreshToken = sessionStorage.getItem('byk_refresh_token') || localStorage.getItem('byk_refresh_token');
      if (savedUser || token || refreshToken) {
        store.dispatch(setCredentials({
          user: savedUser ? JSON.parse(savedUser) : null,
          token: token || null,
          refreshToken: refreshToken || null
        }));
      }
    } catch (e) {
      console.warn('Failed restoring auth:', e);
    }
    store.dispatch(fetchCurrentUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
