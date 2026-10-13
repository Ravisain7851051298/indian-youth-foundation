import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. Submit Membership Application with screenshot & UTR
export const submitMembershipApplication = createAsyncThunk(
  'applications/submitMembershipApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/members/apply', formData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting membership application');
    }
  }
);

// 2. Submit Volunteer Application
export const submitVolunteerApplication = createAsyncThunk(
  'applications/submitVolunteerApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/volunteers/apply', formData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting volunteer application');
    }
  }
);

// 3. Admin: Fetch Member Applications
export const fetchMemberApplications = createAsyncThunk(
  'applications/fetchMemberApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/applications/members');
      if (res.data.success) {
        return res.data.applications;
      }
      return rejectWithValue('Failed to load applications');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error loading applications');
    }
  }
);

// 4. Admin: Fetch Volunteer Applications
export const fetchVolunteerApplications = createAsyncThunk(
  'applications/fetchVolunteerApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/applications/volunteers');
      if (res.data.success) {
        return res.data.applications;
      }
      return rejectWithValue('Failed to load volunteer applications');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error loading volunteer applications');
    }
  }
);

// 5. Admin: Approve Membership Application (Unlocks ID card, Appointment Letter, sends email)
export const approveMembershipApplication = createAsyncThunk(
  'applications/approveMembershipApplication',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/members/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving application');
    }
  }
);

// 6. Admin: Reject Membership Application
export const rejectMembershipApplication = createAsyncThunk(
  'applications/rejectMembershipApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/members/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.application;
      }
      return rejectWithValue(res.data.message || 'Rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting application');
    }
  }
);

// 7. Admin: Approve Volunteer Application (Sends welcome email & unlocks offer letter)
export const approveVolunteerApplication = createAsyncThunk(
  'applications/approveVolunteerApplication',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/volunteers/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Volunteer approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving volunteer');
    }
  }
);

// 8. Admin: Reject Volunteer Application
export const rejectVolunteerApplication = createAsyncThunk(
  'applications/rejectVolunteerApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/volunteers/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.application;
      }
      return rejectWithValue(res.data.message || 'Rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting volunteer');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    memberApplications: [],
    volunteerApplications: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearAppStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Member Applications
      .addCase(fetchMemberApplications.fulfilled, (state, action) => {
        state.memberApplications = action.payload;
      })
      // Fetch Volunteer Applications
      .addCase(fetchVolunteerApplications.fulfilled, (state, action) => {
        state.volunteerApplications = action.payload;
      })
      // Submit Member Application
      .addCase(submitMembershipApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMembershipApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Application submitted for verification!';
        if (action.payload.application) {
          state.memberApplications.unshift(action.payload.application);
        }
      })
      .addCase(submitMembershipApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Volunteer Application
      .addCase(submitVolunteerApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitVolunteerApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Volunteer application submitted!';
        if (action.payload.application) {
          state.volunteerApplications.unshift(action.payload.application);
        }
      })
      .addCase(submitVolunteerApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Member Application
      .addCase(approveMembershipApplication.fulfilled, (state, action) => {
        const app = action.payload.application;
        const index = state.memberApplications.findIndex(a => a._id === app._id);
        if (index !== -1) {
          state.memberApplications[index] = app;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Member Application
      .addCase(rejectMembershipApplication.fulfilled, (state, action) => {
        const index = state.memberApplications.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.memberApplications[index] = action.payload;
        }
      })
      // Approve Volunteer Application
      .addCase(approveVolunteerApplication.fulfilled, (state, action) => {
        const app = action.payload.application;
        const index = state.volunteerApplications.findIndex(a => a._id === app._id);
        if (index !== -1) {
          state.volunteerApplications[index] = app;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Volunteer Application
      .addCase(rejectVolunteerApplication.fulfilled, (state, action) => {
        const index = state.volunteerApplications.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.volunteerApplications[index] = action.payload;
        }
      });
  }
});

export const { clearAppStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
