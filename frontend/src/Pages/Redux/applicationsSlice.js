import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Backend se data fetch karne ke liye thunk
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (workerEmail = null, { rejectWithValue }) => {
    try {
      const url = workerEmail
        ? `http://localhost:5000/api/apply?workerEmail=${encodeURIComponent(
            workerEmail
          )}`
        : `http://localhost:5000/api/apply`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch applications");
      //return await response.json();

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid JSON response");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    filteredApplications: [],
    loading: false,
    error: null,
    showModal: false,
    currentJob: null,
  },

  reducers: {
    setFilteredApplications: (state, action) => {
      state.filteredApplications = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
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

export const { setFilteredApplications, setShowModal, setCurrentJob } =
  applicationsSlice.actions;
export default applicationsSlice.reducer;
