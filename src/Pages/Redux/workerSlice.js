import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workers: [
    { id: 1, name: "John Doe", present: false, dailyWage: 500, daysWorked: 0, payment: 0 },
    { id: 2, name: "Jane Smith", present: false, dailyWage: 600, daysWorked: 0, payment: 0 },
    { id: 3, name: "Michael Brown", present: false, dailyWage: 550, daysWorked: 0, payment: 0 },
    { id: 4, name: "Amli Sek", present: false, dailyWage: 550, daysWorked: 0, payment: 0 },
  ],
  totalDays: 0,
};
const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    toggleAttendance: (state, action) => {
      const worker = state.workers.find((w) => w.id === action.payload);
      if (worker) {
        worker.present = !worker.present;
      }
    },
    processPayments: (state) => {
      state.totalDays += 1;
      state.workers.forEach((worker) => {
        if (worker.present) {
          worker.daysWorked += 1;
        }
        worker.payment = worker.daysWorked * worker.dailyWage;
        worker.present = false; // Reset attendance
      });
    },
  },
});

export const { toggleAttendance, processPayments } = workerSlice.actions;
export default workerSlice.reducer;