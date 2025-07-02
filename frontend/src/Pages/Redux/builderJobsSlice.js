import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBuilderJobs = createAsyncThunk(
  "builderJobs/fetchBuilderJobs",
  async (userId) => {
    const res = await fetch(`http://localhost:5000/api/jobs/builder/${userId}`);
    const data = await res.json();
    return data;
  }
);

const builderJobsSlice = createSlice({
  name: "builderJobs",
  initialState: {
    jobs: [],
    allJobs: [],
    projectsWithJobs: [],
    loading: false,
    error: null,
    totalJobs: 0,
    totalProjects: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuilderJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuilderJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.projectsWithJobs = action.payload.data;
          state.totalJobs = action.payload.totalJobs || 0;
          state.totalProjects = action.payload.totalProjects || 0;
          
          state.allJobs = action.payload.data.reduce((acc, project) => {
            return acc.concat(project.jobs || []);
          }, []);
        }
      })
      .addCase(fetchBuilderJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = builderJobsSlice.actions;
export default builderJobsSlice.reducer;