import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Backend se data fetch karne ke liye thunk

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async ({ workerEmail = null, status = null, experience = null }, { rejectWithValue }) => {
    try {
      let url = `http://localhost:5000/api/apply`;
      const queryParams = [];

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


export const {setFilteredApplications, setShowModal,setFilter,  setCurrentJob  } =
  applicationsSlice.actions;
export default applicationsSlice.reducer;



//AppliActionSlice
// import { setApplications } from './AppliModelSlice';

// export const fetchApplications = (workerEmail) => async (dispatch) => {
//   try {
//     // const response = await fetch(
//     //   `http://localhost:5000/api/applications?workerEmail=${workerEmail}`
//     // );
//     const response = await fetch(`http://localhost:5000/api/apply?workerEmail=${workerEmail}`);
//     const data = await response.json();
//     dispatch(setApplications(data));
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//   }
// };





//AppliModelSlice
//import { createSlice } from "@reduxjs/toolkit";

// const AppliModelSlice = createSlice({
//   name: 'applicationsModel',
//   initialState: {
//     filter: 'All',
//     showModal: false,
//     currentJob: null,
//     allApplications: [], // removed dummy static data
//   },
//   reducers: {
//     setFilter(state, action) {
//       state.filter = action.payload;
//     },
//     setShowModal(state, action) {
//       state.showModal = action.payload;
//     },
//     setCurrentJob(state, action) {
//       state.currentJob = action.payload;
//     },
//     setApplications(state, action) {
//       state.allApplications = action.payload;
//     },
//   },
// });

// export const {
//   setFilter,
//   setShowModal,
//   setCurrentJob,
//   setApplications,
// } = AppliModelSlice.actions;

// export default AppliModelSlice.reducer;

