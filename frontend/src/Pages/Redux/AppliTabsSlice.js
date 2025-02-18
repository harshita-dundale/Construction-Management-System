import { createSlice } from "@reduxjs/toolkit";

const appTabsSlice = createSlice({
  name: "appTabs",
  initialState: {
    activeTab: "All", // Default active tab
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload; // Update the active tab
    },
  },
});

export const { setActiveTab } = appTabsSlice.actions;
export default appTabsSlice.reducer;
