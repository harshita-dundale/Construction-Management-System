import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullName: '',
  phoneNo: '',
  skills: '', 
  experience: '',   
  applyDate: '',   
};

const applyJobSlice = createSlice({
  name: 'applyJob',
  initialState,
  reducers: {
    setFullName: (state, action) => {
      state.fullName = action.payload;
    },
    setPhoneNo: (state, action) => {
      state.phoneNo = action.payload;
    },
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    setExperience: (state, action) => {
      state.experience = action.payload;
    },
    setApplyDate: (state, action) => {
      state.applyDate = action.payload;
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setFullName,
  setPhoneNo,
  setSkills,
  setExperience,
  setApplyDate,
  resetForm,
} = applyJobSlice.actions;

export default applyJobSlice.reducer;