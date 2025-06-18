  import { createSlice } from "@reduxjs/toolkit";

const AppliModelSlice = createSlice({
  name: 'applicationsModel',
  initialState: {
    filter: 'All',
    showModal: false,
    currentJob: null,
    allApplications: [], // removed dummy static data
  },
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setCurrentJob(state, action) {
      state.currentJob = action.payload;
    },
    setApplications(state, action) {
      state.allApplications = action.payload;
    },
  },
});

export const {
  setFilter,
  setShowModal,
  setCurrentJob,
  setApplications,
} = AppliModelSlice.actions;

export default AppliModelSlice.reducer;

