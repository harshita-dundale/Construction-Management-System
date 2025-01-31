import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobTabs: ["Job A", "Job B", "Job C"],
  attendanceData: {
    totalDays: 20,
    absentDays: 5,
    percentage: 75,
  },
  paymentData: {
    dailyWage: 500,
    totalPaid: 10000,
    pending: 2000,
  },
  paymentHistory: [
    { date: "2025-01-01", amount: 1500, status: "Present" },
    { date: "2025-01-05", amount: 2000, status: "Absent" },
    { date: "2025-01-10", amount: 3000, status: "Present" },
  ],
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    togglePaymentHistory: (state, action) => {
      state.showPaymentHistory = action.payload;
    },
  },
});

export const { togglePaymentHistory } = attendanceSlice.actions;
export default attendanceSlice.reducer;