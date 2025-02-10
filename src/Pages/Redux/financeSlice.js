import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workerPayments: 0,
  materialCosts: 0,
  revenue: 0,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setWorkerPayments: (state, action) => {
      state.workerPayments = action.payload;
    },
    setMaterialCosts: (state, action) => {
      state.materialCosts = action.payload;
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
  },
});

export const { setWorkerPayments, setMaterialCosts, setRevenue } = financeSlice.actions;
export default financeSlice.reducer;
