'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { fetchCurrentUser, setUser } from './authSlice';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('byk_user') || localStorage.getItem('byk_user');
      if (saved) {
        store.dispatch(setUser(JSON.parse(saved)));
      }
    } catch {}
    store.dispatch(fetchCurrentUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
