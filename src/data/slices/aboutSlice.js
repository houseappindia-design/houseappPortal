import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// GET - fetch existing content
export const fetchAboutContent = createAsyncThunk(
  'about/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/about-us');
      console.log(response.data?.data.data[0], '👉 About Us response');

      // ✅ Use `response`, not `res`
      return response.data?.data.data[0]; // adjust based on actual API structure
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// POST - create or update content
export const postAboutContent = createAsyncThunk(
  'about/postContent',
  async (content, { rejectWithValue }) => {
    console.log(content,"hfkrh")
    try {
      const response = await axios.post('/about-us', {content:content});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    content: null,
    loading: false,
    saving: false,
    error: null,
    saveSuccess: false,
  },
  reducers: {
    resetSaveStatus(state) {
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchAboutContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutContent.fulfilled, (state, action) => {
  console.log(action.payload, '✅ Fetched About Us content');
  state.loading = false;
  state.content = action.payload;
})
      .addCase(fetchAboutContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post content
      .addCase(postAboutContent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(postAboutContent.fulfilled, (state, action) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(postAboutContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const { resetSaveStatus } = aboutSlice.actions;

export default aboutSlice.reducer;
