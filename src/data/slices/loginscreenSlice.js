// src/redux/slices/loginscreenSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import axioss from 'axios';

const BASE_API_URL = import.meta.env.VITE_PRODUCTION_URL;

// =========================
// ✅ CREATE Login Screen
// =========================
export const createLoginscreen = createAsyncThunk(
  'loginscreen/create',
  async (formData, thunkAPI) => {
    try {
      const res = await axioss.post(
        `${BASE_API_URL}/admin/login-screen/upsert`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Create failed'
      );
    }
  }
);

// =========================
// ✅ FETCH ALL Login Screens
// =========================
export const fetchAllLoginscreen = createAsyncThunk(
  'loginscreen/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`admin/login-screen`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// =========================
// ✅ UPDATE Login Screen
// =========================
export const updateLoginscreenByID = createAsyncThunk(
  'loginscreen/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axioss.patch(
        `${BASE_API_URL}/admin/login-screen/upsert`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Update failed'
      );
    }
  }
);

// =========================
// 🔥 CLEAN SLICE
// =========================

const loginscreenSlice = createSlice({
  name: 'loginscreen',
  initialState: {
    loginscreenData: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createLoginscreen.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLoginscreen.fulfilled, (state, action) => {
        state.loading = false;
        state.loginscreenData.push(action.payload);
      })
      .addCase(createLoginscreen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchAllLoginscreen.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllLoginscreen.fulfilled, (state, action) => {
        state.loading = false;
        state.loginscreenData = action.payload;
      })
      .addCase(fetchAllLoginscreen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateLoginscreenByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLoginscreenByID.fulfilled, (state, action) => {
        state.loading = false;
        state.loginscreenData = state.loginscreenData.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateLoginscreenByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLoginError } = loginscreenSlice.actions;
export default loginscreenSlice.reducer;
