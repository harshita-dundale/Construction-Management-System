import { createSlice } from "@reduxjs/toolkit";

const roleSelected = createSlice({
  name: "role",
  initialState: {
    role: localStorage.getItem("userRole") || null, // LocalStorage se role fetch karega
  },
  reducers: {
    setUserRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("userRole", action.payload); // LocalStorage me bhi update karega
    },
  },
});

export const { setUserRole } = roleSelected.actions;
export default roleSelected.reducer;