import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [], // Builder ke projects list store karne ke liye
  selectedProject: null, // User ka selected project
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
  },
});

export const { setProjects, selectProject, addProject } = projectSlice.actions;
export default projectSlice.reducer;
