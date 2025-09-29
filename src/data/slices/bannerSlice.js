// src/redux/slices/bannerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import axioss from 'axios';
const BASE_IMAGE_URL = import.meta.env.VITE_PRODUCTION_URL;


// === Thunks ===

// Add a new banner
export const createBanner = createAsyncThunk('banners/create', async (formData, thunkAPI) => {
  try {
    console.log(formData,"dksdkgj")
    const res = await axioss.post(`${BASE_IMAGE_URL}/admin/banners`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Fetch all banners
export const fetchAllBanners = createAsyncThunk(
  'banners/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`admin/banners`);
      // Log full response once
      console.log(res.data, "Response from fetchAllBanners");
      // Return final array of banners directly
      return res.data.data;  // Adjust based on real structure
    } catch (err) {
      console.error("Error fetching banners:", err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// Fetch a single banner
export const fetchSingleBanner = createAsyncThunk('banners/fetchSingle', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`admin/banner/${id}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateBannerByID = createAsyncThunk('banners/update', async ({ formData, id }, thunkAPI) => {
  try {
    const res = await axioss.patch(`http://localhost:8000/v1/auth/admin/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});


export const deleteBanner = createAsyncThunk('banners/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`admin/banners/${id}`);
    return id; // sirf id return karenge state se remove karne ke liye
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

// ==
// === Slice ===

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    banners: [],
    banner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all
      .addCase(fetchAllBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        console.log(action.payload.data.data,"data aa gay")
        state.loading = false;
        state.banners = action.payload.data.data;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchSingleBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
      })
      .addCase(fetchSingleBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBannerByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBannerByID.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
        state.banners = state.banners.map(b =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(updateBannerByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        // ✅ Delete
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBannerError } = bannerSlice.actions;
export default bannerSlice.reducer;
