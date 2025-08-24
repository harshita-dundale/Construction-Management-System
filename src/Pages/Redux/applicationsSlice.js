import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [
    {
      id: 1,
      name: "John Doe",
      appliedDate: "2023-12-01",
      experience: 5,
      skills: ["mesonary"],
      status: "under_review",
    },
    {
      id: 2,
      name: "Jane Smith",
      appliedDate: "2023-12-02",
      experience: 3,
      skills: ["labour"],
      status: "shortlisted",
    },
    {
      id: 3,
      name: "Sam Wilson",
      appliedDate: "2023-12-03",
      experience: 7,
      skills: ["painting"],
      status: "rejected",
    },
    {
      id: 4,
      name: "Shivani Malviya",
      appliedDate: "2023-12-03",
      experience: 8,
      skills: ["painting"],
      status: "rejected",
    },
    {
      id: 5,
      name: "Radha Krishna",
      appliedDate: "2023-12-03",
      experience: 10,
      skills: ["painting"],
      status: "rejected",
    },
    {
      id: 6,
      name: "Harshu Prajapat",
      appliedDate: "2023-12-03",
      experience: 9,
      skills: ["painting"],
      status: "rejected",
    },
  ],
  filteredApplications: [],
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setFilteredApplications: (state, action) => {
      state.filteredApplications = action.payload;
    },
  },
});

export const { setApplications, setFilteredApplications } = applicationsSlice.actions;

export default applicationsSlice.reducer;
