// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   applications: [
//     {
//       id: 1,
//       name: "John Doe",
//       appliedDate: "2023-12-01",
//       experience: 5,
//       skills: ["mesonary"],
//       status: "under_review",
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       appliedDate: "2023-12-02",
//       experience: 3,
//       skills: ["labour"],
//       status: "shortlisted",
//     },
//     {
//       id: 3,
//       name: "Sam Wilson",
//       appliedDate: "2023-12-03",
//       experience: 7,
//       skills: ["painting"],
//       status: "rejected",
//     },
//     {
//       id: 4,
//       name: "Shivani Malviya",
//       appliedDate: "2023-12-03",
//       experience: 8,
//       skills: ["painting"],
//       status: "rejected",
//     },
//     {
//       id: 5,
//       name: "Radha Krishna",
//       appliedDate: "2023-12-03",
//       experience: 10,
//       skills: ["painting"],
//       status: "rejected",
//     },
//     {
//       id: 6,
//       name: "Harshu Prajapat",
//       appliedDate: "2023-12-03",
//       experience: 9,
//       skills: ["painting"],
//       status: "rejected",
//     },
//   ],
//   filteredApplications: [],
// };

// const applicationsSlice = createSlice({
//   name: 'applications',
//   initialState,
//   reducers: {
//     setApplications: (state, action) => {
//       state.applications = action.payload;
//     },
//     setFilteredApplications: (state, action) => {
//       state.filteredApplications = action.payload;
//     },
//   },
// });

// export const { setApplications, setFilteredApplications } = applicationsSlice.actions;

// export default applicationsSlice.reducer;

// // import { createSlice } from '@reduxjs/toolkit';

// // const initialState = {
// //   applications: [],
// //   filteredApplications: [],
// // };

// // const applicationsSlice = createSlice({
// //   name: 'applications',
// //   initialState,
// //   reducers: {
// //     setApplications: (state, action) => {
// //       state.applications = action.payload;
// //     },
// //     setFilteredApplications: (state, action) => {
// //       state.filteredApplications = action.payload;
// //     },
// //   },
// // });

// // export const { setApplications, setFilteredApplications } = applicationsSlice.actions;

// // export default applicationsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Backend se data fetch karne ke liye thunk
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
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
