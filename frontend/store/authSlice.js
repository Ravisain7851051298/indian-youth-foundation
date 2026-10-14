import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

/**
 * Dynamic Admin Account Creation using X-ADMIN-SECRET-KEY
 */
export const createAdminUser = createAsyncThunk(
  'auth/createAdminUser',
  async ({ adminData, adminSecretKey }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/create-admin', adminData, {
        headers: {
          'x-admin-secret-key': adminSecretKey
        }
      });
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Admin creation failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Error creating admin');
    }
  }
);

/**
 * Sign in (Browser automatically handles secure HTTP-Only cookie)
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login error');
    }
  }
);

/**
 * Register Member or Volunteer
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration error');
    }
  }
);

/**
 * Logout User: Revokes token in MongoDB TTL blacklist & clears HTTP-Only cookies
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/logout');
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
      return res.data;
    } catch (err) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
      return rejectWithValue(err.response?.data?.message || 'Logout error');
    }
  }
);

/**
 * Fetch Current User from backend using HTTP-Only cookie session
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data.user;
      }
      return rejectWithValue('User fetch failed');
    } catch (err) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
      return rejectWithValue(err.response?.data?.message || 'Error fetching user');
    }
  }
);

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('byk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('byk_user');
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('byk_user', JSON.stringify(action.payload));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Admin
      .addCase(createAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = 'Admin account verified & initialized!';
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Admin creation failed';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
      });
  }
});

export const { logout, setUser, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
