

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Backend se data fetch karne ke liye thunk
export const fetchApplications = createAsyncThunk('applications/fetchApplications', async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/apply'); // Backend API
      if (!response.ok) throw new Error("Failed to fetch applications");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [], // Default empty rakha hai, backend se update hoga
    filteredApplications: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFilteredApplications: (state, action) => {
      state.filteredApplications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilteredApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;
