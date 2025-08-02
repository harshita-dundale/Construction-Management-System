import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch payrolls by projectId
export const fetchPayrollsByProject = createAsyncThunk(
  'payroll/fetchPayrollsByProject',
  async (projectId, thunkAPI) => {
    const response = await fetch(`http://localhost:5000/api/payrolls/by-project/${projectId}`);
    const data = await response.json();
    return data;
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    payrollList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollsByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollsByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollList = action.payload;
      })
      .addCase(fetchPayrollsByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default payrollSlice.reducer;