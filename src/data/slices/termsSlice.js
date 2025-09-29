import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// ✅ GET Terms & Conditions
export const fetchTermsContent = createAsyncThunk(
  'terms/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/terms');
      return response.data?.data.data[0]; // Adjust this based on your API structure
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ POST (create or update)
export const postTermsContent = createAsyncThunk(
  'terms/postContent',
  async (content, { rejectWithValue }) => {
    try {
      const response = await axios.post('/terms', {content:content});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    content: null,
    loading: false,
    saving: false,
    saveSuccess: false,
    error: null,
  },
  reducers: {
    resetTermsSaveStatus(state) {
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ GET
      .addCase(fetchTermsContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermsContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchTermsContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ POST
      .addCase(postTermsContent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(postTermsContent.fulfilled, (state) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(postTermsContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const { resetTermsSaveStatus } = termsSlice.actions;

export default termsSlice.reducer;
