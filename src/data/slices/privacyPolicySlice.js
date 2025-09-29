import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';


// ✅ Fetch Privacy Policy Content (GET)
export const fetchPrivacyPolicy = createAsyncThunk(
  'privacy/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/privacy-policy');
      console.log(response.data?.data.data[0],"privacy-policy")
      return response.data?.data.data[0]; // Adjust depending on actual API response shape
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Add or Update Privacy Policy Content (POST)
export const postPrivacyPolicy = createAsyncThunk(
  'privacy/postContent',
  async (contentData, { rejectWithValue }) => {
    try {
      debugger
      const response = await axios.post('/privacy-policy', {content:contentData});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Slice
const privacyPolicySlice = createSlice({
  name: 'privacyPolicy',
  initialState: {
    content: null,
    loading: false,
    saving: false,
    saveSuccess: false,
    error: null,
  },
  reducers: {
    resetPrivacySaveStatus(state) {
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        console.log(action.payload)
        
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post
      .addCase(postPrivacyPolicy.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(postPrivacyPolicy.fulfilled, (state) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(postPrivacyPolicy.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const { resetPrivacySaveStatus } = privacyPolicySlice.actions;

export default privacyPolicySlice.reducer;
