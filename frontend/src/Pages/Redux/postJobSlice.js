// src/Redux/postJobSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobTitle: '',
  skillsRequired: 'masonry', // Default value
  dailyPayment: '',
  startDate: '',
  endDate: '',
  location: '',
  email: '',
  phoneNo: '',
};

const postJobSlice = createSlice({
  name: 'postJob',
  initialState,
  reducers: {
    setJobTitle: (state, action) => {
      state.jobTitle = action.payload;
    },
    setSkillsRequired: (state, action) => {
      state.skillsRequired = action.payload;
    },
    setDailyPayment: (state, action) => {
      state.dailyPayment = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhoneNo: (state, action) => {
      state.phoneNo = action.payload;
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setJobTitle,
  setSkillsRequired,
  setDailyPayment,
  setStartDate,
  setEndDate,
  setLocation,
  setEmail,
  setPhoneNo,
  resetForm,
} = postJobSlice.actions;

export default postJobSlice.reducer;