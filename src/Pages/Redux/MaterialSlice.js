import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  materials: [],
  filter: "",
};

const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    addMaterial: (state, action) => {
      state.materials.push({
        ...action.payload,
        id: Date.now(),
        unitPrice: parseFloat(action.payload.unitPrice),
      });
    },
    updateUsage: (state, action) => {
      const { name, quantityUsed } = action.payload;
      state.materials = state.materials.map((material) =>
        material.name === name
          ? { ...material, quantity: material.quantity - quantityUsed }
          : material
      );
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addMaterial, updateUsage, setFilter } = materialSlice.actions;
export default materialSlice.reducer;
