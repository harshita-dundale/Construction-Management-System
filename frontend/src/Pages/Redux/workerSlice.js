import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchWorkers = createAsyncThunk("workers/fetchWorkers", async () => {
  const response = await fetch("http://localhost:5000/api/apply");
  const data = await response.json();

  return data.map((worker, index) => ({
    id: worker._id || index + 1,
    name:
      typeof worker.name === "string"
        ? worker.name
        : worker.name && typeof worker.name === "object"
        ? `${worker.name.first || ""} ${worker.name.last || ""}`.trim()
        : "Unnamed",
    dailyWage: worker.dailyWage || 500,
    present: false,
    daysWorked: 0,
    payment: 0,
  }));
});

export const saveAttendance = createAsyncThunk(
  "workers/saveAttendance",
  async (workers) => {
    const response = await fetch("http://localhost:5000/api/attendance/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workers),
    });
    if (!response.ok) {
      throw new Error("Failed to save attendance");
    }
    return await response.json();
  }
);

const initialState = {
  workers: [],
  loading: false,
  error: null,
  totalDays: 0,
  saveLoading: false,
  saveError: null,
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
        worker.present = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(saveAttendance.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(saveAttendance.fulfilled, (state) => {
        state.saveLoading = false;
       
      })
      .addCase(saveAttendance.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.error.message;
      });
  },
});

export const { toggleAttendance, processPayments } = workerSlice.actions;
export default workerSlice.reducer;