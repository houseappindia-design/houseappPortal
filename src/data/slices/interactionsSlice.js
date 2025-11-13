// src/redux/interactionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// Fetch interactions data
export const fetchInteractions = createAsyncThunk(
  'interactions/fetchInteractions',
  async ({ range = 'today', page = 1, pageSize = 10,startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `admin/interactions?range=${range}&page=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`
      );
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

// Fetch agent view log
export const trackAgentView = createAsyncThunk(
  'interactions/trackAgentView',
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `admin/agent-view-log?page=${page}&pageSize=${pageSize}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

// Fetch search activity log
export const recordSearchActivity = createAsyncThunk(
  'interactions/recordSearchActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("admin/search-activity-log");
      console.log(response.data,"Serach coutn")
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

export const fetchLocalityViewers = createAsyncThunk(
  'localities/fetchLocalityViewers',
  async (localityId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`admin/locality-viewers/${localityId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Interactions slice
const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    whatsapp: [],
    phone: [],
    agentViews: [],
    searchActivityLog: [],
    viewers: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchInteractions
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        const { whatsapp, phone,map, total, page, limit } = action.payload || {};
        state.loading = false;
        state.whatsapp = whatsapp;
        state.phone = phone;
        state.mapdata = map;
        state.total = total;
        state.page = page;
        state.limit = limit;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // trackAgentView
      .addCase(trackAgentView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackAgentView.fulfilled, (state, action) => {
        const { data, currentPage, totalPages, totalRecords } = action.payload || {};
        state.agentViews = data || [];
        state.page = currentPage || 1;
        state.limit = totalPages || 10;
        state.total = totalRecords || 0;
        state.loading = false;
      })
      .addCase(trackAgentView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // recordSearchActivity
      .addCase(recordSearchActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordSearchActivity.fulfilled, (state, action) => {
        console.log(action.payload,"Payload")
        state.loading = false;
        state.searchActivityLog = action.payload;
      })
      .addCase(recordSearchActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
       .addCase(fetchLocalityViewers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocalityViewers.fulfilled, (state, action) => {
        state.loading = false;
        state.viewers = action.payload;
      })
      .addCase(fetchLocalityViewers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});



export default interactionsSlice.reducer;
