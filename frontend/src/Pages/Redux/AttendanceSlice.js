import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for attendance summary by email
export const fetchAttendanceSummary = createAsyncThunk(
  "attendance/fetchAttendanceSummary",
  async (email) => {
    const response = await fetch(`http://localhost:5000/api/attendance/summary?email=${email}`);
    if (!response.ok) throw new Error("Failed to fetch attendance summary");
    const data = await response.json();
    return data;
  }
);

// Async thunk for attendance history (replace with dynamic URL in real use)
export const fetchAttendanceHistory = createAsyncThunk(
  "attendance/fetchAttendanceHistory",
  
  async ({ workerId, jobId }) => {
    if (!workerId || !jobId) {
      console.log("job or worker id is not found");
      return;
    }; // or show message to user

    console.log(workerId, "this is worker id and ", jobId, "this is jobid");
    const response = await fetch(`http://localhost:5000/api/attendance/worker-attendance?workerId=${workerId}&jobId=${jobId}`);
    if (!response.ok) throw new Error("Failed to fetch attendance data");
    const data = await response.json();
    return data;
  }
);

// Cleaned state
const initialState = {
  attendanceData: [], // from summary endpoint
  attendanceHistory: [], // individual records
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
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceHistory = action.payload;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default attendanceSlice.reducer;
