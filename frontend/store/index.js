import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import planReducer from './planSlice';
import applicationReducer from './applicationSlice';
import donationReducer from './donationSlice';
import ngoReducer from './ngoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: planReducer,
    applications: applicationReducer,
    donations: donationReducer,
    ngo: ngoReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
