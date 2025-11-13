import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// GET - fetch existing content
export const fetchContactContent = createAsyncThunk(
  'contact/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/contact-us');
      console.log(response.data?.data.data[0], '👉 Contact Us response');

      // ✅ Use `response`, not `res`
      return response.data?.data.data[0]; // adjust based on actual API structure
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// POST - create or update content
export const postContactContent = createAsyncThunk(
  'contact/postContent',
  async (content, { rejectWithValue }) => {
    console.log(content,"hfkrh")
    try {
      const response = await axios.post('/contact-us', {content:content});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
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
      .addCase(fetchContactContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactContent.fulfilled, (state, action) => {
  console.log(action.payload, '✅ Fetched About Us content');
  state.loading = false;
  state.content = action.payload;
})
      .addCase(fetchContactContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post content
      .addCase(postContactContent.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(postContactContent.fulfilled, (state, action) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(postContactContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const { resetSaveStatus } = contactSlice.actions;

export default contactSlice.reducer;
