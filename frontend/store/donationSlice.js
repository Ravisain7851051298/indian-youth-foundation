import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. Fetch All Donations (Admin) or User Donations
export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/donations');
      if (res.data.success) {
        return res.data.donations;
      }
      return rejectWithValue('Failed to load donations');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching donations');
    }
  }
);

// 2. Submit Donation (Status enters pending; receipt is NOT generated directly!)
export const submitDonation = createAsyncThunk(
  'donations/submitDonation',
  async (donationData, { rejectWithValue }) => {
    try {
      const res = await api.post('/donations/verify', donationData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Donation submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting donation');
    }
  }
);

// Backward-compatible alias for recordDonation
export const recordDonation = submitDonation;

// 3. Admin: Approve Donation (Generates 80G receipt, updates funds, sends tax receipt email)
export const approveDonation = createAsyncThunk(
  'donations/approveDonation',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/donations/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Donation approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving donation');
    }
  }
);

// 4. Admin: Reject Donation
export const rejectDonation = createAsyncThunk(
  'donations/rejectDonation',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/donations/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.donation;
      }
      return rejectWithValue(res.data.message || 'Donation rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting donation');
    }
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    donations: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearDonationStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Donations
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Donation
      .addCase(submitDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        if (action.payload.donation) {
          state.donations.unshift(action.payload.donation);
        }
      })
      .addCase(submitDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Donation
      .addCase(approveDonation.fulfilled, (state, action) => {
        const approved = action.payload.donation;
        const index = state.donations.findIndex(d => d._id === approved._id);
        if (index !== -1) {
          state.donations[index] = approved;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Donation
      .addCase(rejectDonation.fulfilled, (state, action) => {
        const rejected = action.payload;
        const index = state.donations.findIndex(d => d._id === rejected._id);
        if (index !== -1) {
          state.donations[index] = rejected;
        }
      });
  }
});

export const { clearDonationStatus } = donationSlice.actions;
export default donationSlice.reducer;
