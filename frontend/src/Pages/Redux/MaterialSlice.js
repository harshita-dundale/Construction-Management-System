import { createSlice } from "@reduxjs/toolkit";

const materialSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    filter: "",
  },
  reducers: {
    setMaterials(state, action) {
      state.materials = action.payload;
    },
    addMaterial(state, action) {
      state.materials.push(action.payload);
    },
    updateUsage(state, action) {
      const updated = action.payload;
      const index = state.materials.findIndex((m) => m._id === updated._id);
      if (index !== -1) {
        state.materials[index] = updated;
      }
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },

    deleteMaterial(state, action) {
      const idToDelete = action.payload;
      state.materials = state.materials.filter((mat) => mat._id !== idToDelete);
    },
  },
});

export const {
  setMaterials,
  addMaterial,
  updateUsage,
  setFilter,
  deleteMaterial,  
} = materialSlice.actions;

export default materialSlice.reducer;
