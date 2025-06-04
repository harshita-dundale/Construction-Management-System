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
  },
});

export const { setMaterials, addMaterial, updateUsage, setFilter } = materialSlice.actions;
export default materialSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   materials: [],
//   filter: "",
// };

// const materialSlice = createSlice({
//   name: "materials",
//   initialState,
//   reducers: {
//     addMaterial: (state, action) => {
//       state.materials.push({
//         ...action.payload,
//         id: Date.now(), // Optional, since backend _id already exists
//         unitPrice: parseFloat(action.payload.unitPrice),
//       });
//     },
//     updateUsage: (state, action) => {
//       const { name, quantityUsed } = action.payload;
//       state.materials = state.materials.map((material) =>
//         material.name === name
//           ? { ...material, quantity: material.quantity - quantityUsed }
//           : material
//       );
//     },
//     setFilter: (state, action) => {
//       state.filter = action.payload;
//     },
//     setMaterials: (state, action) => {
//       state.materials = action.payload;
//     },
//   },
// });

// export const { addMaterial, updateUsage, setFilter, setMaterials } = materialSlice.actions;
// export default materialSlice.reducer;
