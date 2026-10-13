import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/plans');
      if (res.data.success) {
        return res.data.plans;
      }
      return rejectWithValue('Failed to load plans');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching membership plans');
    }
  }
);

export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const res = await api.post('/plans', planData);
      if (res.data.success) {
        return res.data.plan;
      }
      return rejectWithValue(res.data.message || 'Failed to create plan');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error creating plan');
    }
  }
);

export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/plans/${id}`, planData);
      if (res.data.success) {
        return res.data.plan;
      }
      return rejectWithValue(res.data.message || 'Failed to update plan');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating plan');
    }
  }
);

export const deletePlan = createAsyncThunk(
  'plans/deletePlan',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/plans/${id}`);
      if (res.data.success) {
        return id;
      }
      return rejectWithValue('Failed to delete plan');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error deleting plan');
    }
  }
);

const planSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearPlanStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Plan
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
        state.successMessage = 'Plan created successfully';
      })
      // Update Plan
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.successMessage = 'Plan updated successfully';
      })
      // Delete Plan
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(p => p._id !== action.payload);
        state.successMessage = 'Plan removed successfully';
      });
  }
});

export const { clearPlanStatus } = planSlice.actions;
export default planSlice.reducer;
