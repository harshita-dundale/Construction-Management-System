// src/Redux/hiredWorkersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  filteredUsers: [],
  ratings: {},
  filterLocation: '',
  sortOption: 'none',
};

const hiredWorkersSlice = createSlice({
  name: 'hiredWorkers',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    setRatings: (state, action) => {
      const { builderId, rating } = action.payload;
      state.ratings[builderId] = rating;
    },
    setFilterLocation: (state, action) => {
      state.filterLocation = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
  },
});

export const {
  setUsers,
  setFilteredUsers,
  setRatings,
  setFilterLocation,
  setSortOption,
} = hiredWorkersSlice.actions;

export default hiredWorkersSlice.reducer;