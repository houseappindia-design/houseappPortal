import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// ─── FETCH PAGINATED EMPLOYEES ─────────────────────────────────────────────
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async ({ page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `admin/employee?page=${page}&pageSize=${pageSize}`
      );
      // Response expected: { message, user: { data: [...], pagination: {...} } }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── ADD EMPLOYEE ───────────────────────────────────────────────────────────
export const addEmployees = createAsyncThunk(
  'employees/addEmployees',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('admin/employee', userData);
      // Response expected: { message, user: { data: {...} } }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ─── UPDATE EMPLOYEE ────────────────────────────────────────────────────────
export const updateEmployees = createAsyncThunk(
  'employees/updateEmployees',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`admin/employee/${id}`, userData);
      // Response expected: { message, user: { data: {...} } }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// slices/managerSlice.js
export const assignLocality = createAsyncThunk(
  'managers/assignLocality',
  async ({ manager_id, locality_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post('admin/assign', { manager_id, locality_id });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ─── EMPLOYEE SLICE ─────────────────────────────────────────────────────────
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: {
      data: [],
      total: 0,
    },
    message: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH EMPLOYEES
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list.data = payload.user?.data || [];
        state.list.total = payload.user?.pagination?.total || 0;
        state.message = payload.message || null;
      })
      .addCase(fetchEmployees.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ADD EMPLOYEE
    builder
      .addCase(addEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployees.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message || null;
        if (payload.user?.data) {
          state.list.data.push(payload.user.data); // Append new employee
        }
      })
      .addCase(addEmployees.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // UPDATE EMPLOYEE
    builder
      .addCase(updateEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployees.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message || null;

        const updatedEmployee = payload.user?.data;
        if (updatedEmployee) {
          const index = state.list.data.findIndex(
            (emp) => emp.id === updatedEmployee.id
          );
          if (index !== -1) {
            state.list.data[index] = updatedEmployee;
          }
        }
      })
      .addCase(updateEmployees.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
    builder
      .addCase(assignLocality.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignLocality.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload.message;
      })
      .addCase(assignLocality.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

  },
});

// ─── EXPORTS ────────────────────────────────────────────────────────────────
export const { resetMessage } = employeeSlice.actions;
export default employeeSlice.reducer;
