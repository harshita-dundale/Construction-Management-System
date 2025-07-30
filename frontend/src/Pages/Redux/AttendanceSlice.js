import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for attendance summary by email
export const fetchAttendanceSummary = createAsyncThunk(
  "attendance/fetchAttendanceSummary",
  async (email, thunkAPI) => {
    try {
    const response = await fetch(`http://localhost:5000/api/attendance/summary?email=${email}`);
    if (!response.ok) throw new Error("Failed to fetch attendance summary");
    const data = await response.json();
    return data;
    } catch (error){
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch worker summary");
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  "attendance/fetchAttendanceHistory",
  async (email, thunkAPI) => {
    try {
      const response = await 
      //fetch(`http://localhost:5000/api/attendance/full-history?email=${email}`);
      fetch(`http://localhost:5000/api/worker-records/full-history?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch full attendance history");
      const data = await response.json();
      console.log("Fetched records:", data); 
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch");
    }
  } 
);

const initialState = {
  attendanceSummary: [],
  summaryStatus: "idle",
  summaryError: null,
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
      state.summaryStatus = "loading";
      state.summaryError = null;
    })
    .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
      state.summaryStatus = "succeeded";
      state.attendanceSummary = action.payload;
    })
    .addCase(fetchAttendanceSummary.rejected, (state, action) => {
      state.summaryStatus = "failed";
      state.summaryError = action.payload || action.error.message;
    })    
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        const flatRecords = action.payload.flatMap(job =>
          job.attendanceRecords.map(record => ({
            ...record,
            jobId: job.jobId,
            projectId: job.projectId,
            jobTitle: job.jobTitle,
          }))
        );
        state.history = action.payload; 
        state.attendanceHistory = flatRecords;
      })      
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default attendanceSlice.reducer;
