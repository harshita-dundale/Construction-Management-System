
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Fetch Projects by userId
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to fetch projects");
      }

      const data = await response.json();
      return data; // { projects: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add New Project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async ({ userId, name }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to add project");
      }

      const data = await response.json();
      return data; // { message, projects: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete Project by ID
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

      const data = await response.json(); // { message, data }
      console.log("data in projsclice",data);
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


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchProjects = createAsyncThunk(
//   "projects/fetchProjects",
//   async (userId, { rejectWithValue }) => {
//     try {
//       console.log("🚀 Fetching projects for user:", userId);

//        const apiUrl = `http://localhost:5000/api/projects/${encodeURIComponent(userId)}`;
//       // console.log("🌍 API URL:", apiUrl);
//       const response = await fetch(apiUrl);
//       console.log("📩 Response Status:", response.status, response.statusText);

//       // if (response.status === 404) {
//       //   console.warn("⚠️ No projects found, returning empty array.");
//       //   return { projects: [] }; // ✅ Handle no projects case
//       // }

//       if (!response.ok) {
//         console.error("❌ Error fetching projects:", response.status, response.statusText);
//         throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("📩 Projects received from backend:", data);
//         return data;

//      // return data.projects || []; // ✅ Ensures array is returned
//     } catch (error) {
//       console.error("❌ Fetch Projects Error:", error.message);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const addProject = createAsyncThunk(
//   "projects/addProject",
//   async ({ userId, name }, { rejectWithValue }) => {
//     try {
//       console.log("📤 Adding project for user:", userId, "Project Name:", name);

//       const response = await fetch("http://localhost:5000/api/projects", {  
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // body: JSON.stringify({ userId, name }),
//         body: JSON.stringify({ userId, name }),
//       });

//       console.log("📩 Response Status:", response.status, response.statusText);

//       const data = await response.json();
//       console.log("📩 Response Data:", data);

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to add project");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Add Project Error:", error.message);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const deleteProject = createAsyncThunk(
//   "project/deleteProject",
//   async (projectId, { rejectWithValue }) => {
//     console.log("🗑 Deleting project ID:", projectId); // Before fetch()
//     try {
//       const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
//         method: "DELETE",
//       });
       
//       if (!response.ok) {
//         throw new Error("Failed to delete project");
//       }
//       const data = await response.json();
//       return data.id; 
//      // return projectId; // returning the ID of deleted project
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const projectSlice = createSlice({
//   name: "project",
//   initialState: {
//   loading: false,
//    projects: [],   // Projects list
//     selectedProject: JSON.parse(localStorage.getItem("selectedProject")) || null,
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     setProjects: (state, action) => {  
//       state.projects = action.payload;
//     },
//     selectProject: (state, action) => {
//       state.selectedProject = action.payload;
//     //  localStorage.setItem("selectedProject", JSON.stringify(action.payload));
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//     .addCase(fetchProjects.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         // state.projects = action.payload.projects;
//         console.log("✅ Projects received:", action.payload);
//         state.loading = false;
//         state.status = "succeeded"; 
//         state.projects = action.payload?.projects || []; // ✅ Ensure array
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         // state.status = "failed";
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(addProject.fulfilled, (state, action) => {
//         // state.projects = action.payload.projects;
//         if (action.payload?.projects) {
//           const latestProject = action.payload.projects[action.payload.projects.length - 1];
//           state.projects = action.payload.projects; // ✅ Replace full list
//           state.selectedProject = latestProject;
//          // localStorage.setItem("selectedProject", JSON.stringify(latestProject));
//         } else if (action.payload) {
//           state.projects.push(action.payload); // ✅ Directly add new project
//         }
//       })
//       .addCase(addProject.rejected, (state, action) => {
//         state.error = action.payload;
//       })
//       .addCase(deleteProject.fulfilled, (state, action) => {
//         const deletedId = action.payload;
//         state.projects = state.projects.filter(project => project._id !== deletedId);
//       })
//       .addCase(deleteProject.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteProject.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
            
//   },
// });

// export const { selectProject } = projectSlice.actions; // ✅ Fix Export
// export default projectSlice.reducer;