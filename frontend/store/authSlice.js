import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('byk_token', res.data.token);
          localStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login error');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('byk_token', res.data.token);
          localStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Registration error');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('byk_user', JSON.stringify(res.data.user));
        }
        return res.data.user;
      }
      return rejectWithValue('User fetch failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching user');
    }
  }
);

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('byk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('byk_token') || null;
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: getInitialToken(),
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('byk_token');
        localStorage.removeItem('byk_user');
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('byk_user', JSON.stringify(action.payload));
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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
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
        state.token = action.payload.token;
        state.successMessage = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout, setUser, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
