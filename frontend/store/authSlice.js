import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const saveUserToStorage = (user, token, refreshToken) => {
  if (typeof window !== 'undefined') {
    try {
      if (user) {
        const serialized = JSON.stringify(user);
        sessionStorage.setItem('byk_user', serialized);
        localStorage.setItem('byk_user', serialized);
      }
      if (token) {
        sessionStorage.setItem('byk_token', token);
        localStorage.setItem('byk_token', token);
        sessionStorage.setItem('token', token);
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        sessionStorage.setItem('byk_refresh_token', refreshToken);
        localStorage.setItem('byk_refresh_token', refreshToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    } catch (e) {
      console.warn('Storage save warning:', e);
    }
  }
};

const clearUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('byk_user');
      localStorage.removeItem('byk_user');
      sessionStorage.removeItem('byk_token');
      localStorage.removeItem('byk_token');
      sessionStorage.removeItem('byk_refresh_token');
      localStorage.removeItem('byk_refresh_token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshToken');
    } catch (e) {
      console.warn('Storage clear warning:', e);
    }
  }
};

const getInitialAuthState = () => ({
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  successMessage: null
});

const notifyUserUpdated = (user) => {
  if (typeof window !== 'undefined' && user) {
    window.dispatchEvent(new CustomEvent('byk_user_updated', { detail: user }));
  }
};

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
        saveUserToStorage(res.data.user, res.data.accessToken || res.data.token, res.data.refreshToken);
        if (adminSecretKey) {
          localStorage.setItem('iyf_admin_secret_key', adminSecretKey);
        }
        notifyUserUpdated(res.data.user);
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Admin creation failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Error creating admin');
    }
  }
);

/**
 * Sign in (Browser automatically handles secure HTTP-Only cookie and Bearer token)
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, identifier }, { rejectWithValue }) => {
    try {
      const loginPayload = {
        email: email || identifier,
        password,
        identifier: identifier || email
      };
      const res = await api.post('/auth/login', loginPayload);
      if (res.data.success) {
        saveUserToStorage(res.data.user, res.data.accessToken || res.data.token, res.data.refreshToken);
        notifyUserUpdated(res.data.user);
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
        saveUserToStorage(res.data.user, res.data.accessToken || res.data.token, res.data.refreshToken);
        notifyUserUpdated(res.data.user);
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
      clearUserFromStorage();
      return res.data;
    } catch (err) {
      clearUserFromStorage();
      return rejectWithValue(err.response?.data?.message || 'Logout error');
    }
  }
);

/**
 * Fetch Current User from backend using HTTP-Only cookie session or Bearer token
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        saveUserToStorage(res.data.user, res.data.accessToken || res.data.token, res.data.refreshToken);
        notifyUserUpdated(res.data.user);
        return res.data;
      }
      return rejectWithValue('User fetch failed');
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserFromStorage();
      }
      return rejectWithValue(err.response?.data?.message || 'Error fetching user');
    }
  }
);

/**
 * Update authenticated user profile fields
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success && res.data.user) {
        saveUserToStorage(res.data.user);
        notifyUserUpdated(res.data.user);
        return res.data.user;
      }
      return rejectWithValue(res.data.message || 'Profile update failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Error updating profile');
    }
  }
);

/**
 * Upload profile photo to uploads/avatars and immediately update profile in DB & Redux
 */
export const uploadAndUpdateAvatar = createAsyncThunk(
  'auth/uploadAndUpdateAvatar',
  async ({ file, category = 'avatars' }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const uploadRes = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-upload-category': category
        }
      });

      if (!uploadRes.data.success || !uploadRes.data.url) {
        return rejectWithValue(uploadRes.data.message || 'Photo upload failed');
      }

      const fileUrl = uploadRes.data.url;
      // Immediately save to MongoDB user profile so it persists across days and refreshes
      const profileRes = await api.put('/auth/profile', { photoUrl: fileUrl });
      if (profileRes.data.success && profileRes.data.user) {
        saveUserToStorage(profileRes.data.user);
        notifyUserUpdated(profileRes.data.user);
        return profileRes.data.user;
      }
      return rejectWithValue(profileRes.data.message || 'Failed to save updated photo to user record');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Photo upload error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.successMessage = null;
      clearUserFromStorage();
    },
    setCredentials: (state, action) => {
      const { user, token, accessToken, refreshToken } = action.payload || {};
      if (user) state.user = user;
      const activeToken = accessToken || token;
      if (activeToken) state.token = activeToken;
      if (refreshToken) state.refreshToken = refreshToken;
      saveUserToStorage(state.user, state.token, state.refreshToken);
      if (user) notifyUserUpdated(user);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      saveUserToStorage(action.payload, state.token, state.refreshToken);
      notifyUserUpdated(action.payload);
    },
    updateUserPhoto: (state, action) => {
      if (state.user) {
        state.user.photoUrl = action.payload;
        saveUserToStorage(state.user, state.token, state.refreshToken);
        notifyUserUpdated(state.user);
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
        state.token = action.payload.accessToken || action.payload.token || state.token;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
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
        state.token = action.payload.accessToken || action.payload.token || state.token;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
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
        state.token = action.payload.accessToken || action.payload.token || state.token;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
        state.successMessage = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.loading = false;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const payloadUser = action.payload?.user || action.payload;
        state.user = payloadUser;
        if (action.payload?.accessToken || action.payload?.token) {
          state.token = action.payload.accessToken || action.payload.token;
        }
        if (action.payload?.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Profile update failed';
      })
      // Upload & Update Avatar
      .addCase(uploadAndUpdateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadAndUpdateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Profile photograph uploaded and synchronized in real-time!';
      })
      .addCase(uploadAndUpdateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Photo upload failed';
      });
  }
});

export const { logout, setCredentials, setUser, updateUserPhoto, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
