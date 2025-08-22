import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Fetch Projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add Project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ userId, name, type, location, clientName }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, type, location, clientName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to add project");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update Project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, name, type, location, clientName }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, location, clientName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to update project");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete Project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    loading: false,
    status: "idle",
    error: null,
    projects: [],
    selectedProject: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔸 FETCH
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.projects = action.payload?.projects || [];
        state.selectedProject = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // 🔸 ADD
      .addCase(addProject.fulfilled, (state, action) => {
        const projects = action.payload?.projects;
        if (projects && projects.length > 0) {
          state.projects = projects;
          state.selectedProject = projects[projects.length - 1];
        }
      })
      .addCase(addProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔸 UPDATE
      .addCase(updateProject.fulfilled, (state, action) => {
        const updatedProject = action.payload?.project;
        if (updatedProject) {
          const index = state.projects.findIndex((p) => p._id === updatedProject._id);
          if (index !== -1) {
            state.projects[index] = updatedProject;
          }
          if (state.selectedProject && state.selectedProject._id === updatedProject._id) {
            state.selectedProject = updatedProject;
            localStorage.setItem("selectedProject", JSON.stringify(updatedProject));
          }
        }
        state.status = "succeeded";
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 🔸 DELETE
      .addCase(deleteProject.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.projects = state.projects.filter((p) => p._id !== deletedId);
        if (state.selectedProject && state.selectedProject._id === deletedId) {
          state.selectedProject = null;
        }
        state.status = "succeeded";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { selectProject, setProjects } = projectSlice.actions;
export default projectSlice.reducer;