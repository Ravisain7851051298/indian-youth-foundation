import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. Fetch Settings
export const fetchSettings = createAsyncThunk(
  'ngo/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/settings');
      if (res.data.success) {
        return res.data.settings;
      }
      return rejectWithValue('Failed to load settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching settings');
    }
  }
);

// 2. Update Settings
export const updateSettings = createAsyncThunk(
  'ngo/updateSettings',
  async (newSettings, { rejectWithValue }) => {
    try {
      const res = await api.put('/settings', newSettings);
      if (res.data.success) {
        return res.data.settings;
      }
      return rejectWithValue(res.data.message || 'Failed to update settings');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating settings');
    }
  }
);

// 3. Fetch Certificates
export const fetchCertificates = createAsyncThunk(
  'ngo/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/certificates');
      if (res.data.success) {
        return res.data.certificates;
      }
      return rejectWithValue('Failed to load certificates');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching certificates');
    }
  }
);

// 4. Issue Certificate (Admin)
export const issueCertificate = createAsyncThunk(
  'ngo/issueCertificate',
  async (certData, { rejectWithValue }) => {
    try {
      const res = await api.post('/certificates', certData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Failed to issue certificate');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error issuing certificate');
    }
  }
);

// 5. Fetch Email Audit Logs (Admin)
export const fetchEmailLogs = createAsyncThunk(
  'ngo/fetchEmailLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/email-logs');
      if (res.data.success) {
        return res.data.logs;
      }
      return rejectWithValue('Failed to load email logs');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching email logs');
    }
  }
);

// 6. Fetch Members
export const fetchMembers = createAsyncThunk(
  'ngo/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/members');
      if (res.data.success) {
        return res.data.members;
      }
      return rejectWithValue('Failed to load members');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching members');
    }
  }
);

// 7. Fetch Campaigns
export const fetchCampaigns = createAsyncThunk(
  'ngo/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/campaigns');
      if (res.data.success) {
        return res.data.campaigns;
      }
      return rejectWithValue('Failed to load campaigns');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching campaigns');
    }
  }
);

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: {
    settings: null,
    certificates: [],
    emailLogs: [],
    members: [],
    campaigns: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearNGOStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.successMessage = 'Settings saved successfully';
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(issueCertificate.fulfilled, (state, action) => {
        if (action.payload.certificate) {
          state.certificates.unshift(action.payload.certificate);
        }
        state.successMessage = action.payload.message || 'Certificate issued!';
      })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => {
        state.emailLogs = action.payload;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.campaigns = action.payload;
      });
  }
});

export const { clearNGOStatus } = ngoSlice.actions;
export default ngoSlice.reducer;
