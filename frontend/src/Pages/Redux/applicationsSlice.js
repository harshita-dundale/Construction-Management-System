import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async ({ workerEmail = null, status = null, experience = null, projectId = null }, { rejectWithValue }) => {
    try {
      let url = `http://localhost:5000/api/apply`;
      const queryParams = [];
      
      if (projectId) queryParams.push(`projectId=${encodeURIComponent(projectId)}`);

      if (workerEmail){
        console.log("🔍 Email passed to thunk:", workerEmail)
        console.log("💡 typeof workerEmail:", typeof workerEmail);
        queryParams.push(`workerEmail=${encodeURIComponent(workerEmail)}`);
        console.log("🔐 fetchApplications received:", { workerEmail, status, experience });

      }    
      if (status && status !== "all") queryParams.push(`status=${encodeURIComponent(status)}`);
      
      if (experience && experience !== "all") queryParams.push(`experience=${encodeURIComponent(experience)}`);

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch applications");

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinAndRejectAppli = createAsyncThunk(
  "applications/updateAction",
  async ({ applicationId, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/apply/${applicationId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Failed to update application");
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    filter: 'All',
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
    setFilter(state, action) {
            state.filter = action.payload;
    },
    setApplications(state, action) {
      state.list = action.payload;
    },    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applications = [];
  state.filteredApplications = [];
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
        state.filteredApplications = action.payload; 
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinAndRejectAppli.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinAndRejectAppli.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApp = action.payload.application;
        // Replace updated application in both lists
        state.applications = state.applications.map((app) =>
          app._id === updatedApp._id ? updatedApp : app
        );
        state.filteredApplications = state.filteredApplications.map((app) =>
          app._id === updatedApp._id ? updatedApp : app
        );
      })
      .addCase(joinAndRejectAppli.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {setFilteredApplications, setShowModal,setFilter,  setCurrentJob,setApplications } =
  applicationsSlice.actions;
export default applicationsSlice.reducer;
