import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance'; // custom axios instance
import axioss from 'axios';

const BASE_IMAGE_URL = import.meta.env.VITE_PRODUCTION_URL;

// ============================
// Cities
// ============================

// Fetch All Cities
export const fetchCities = createAsyncThunk('location/fetchCities', async () => {
  const res = await axios.get('/cities');
  return res.data;
});

// Add City
export const addCity = createAsyncThunk('location/addCity', async (formData) => {
  const res = await axioss.post(`${BASE_IMAGE_URL}/cities`, formData);
  return res.data;
});

// Get City by ID
export const getCityById = createAsyncThunk('location/getCityById', async (id) => {
  const res = await axios.get(`/cities/${id}`);
  return res.data;
});

// Update City
export const updateCity = createAsyncThunk('location/updateCity', async ({ id, data }) => {
  const res = await axioss.put(`${BASE_IMAGE_URL}/cities/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
});

// Delete City
export const deleteCity = createAsyncThunk('location/deleteCity', async (id) => {
  console.log(id)
  debugger
  const res = await axios.delete(`/cities/${id}`);
  return res.data;
});

// ============================
// Areas
// ============================

// Fetch Areas
export const fetchAreas = createAsyncThunk('location/fetchAreas', async ({ cityId }) => {
  const res = await axios.get(`/areas?cityId=${cityId}`);
  return res.data;
});

// Add Area
export const addArea = createAsyncThunk('location/addArea', async (data) => {
  const res = await axios.post('/areas', data);
  return res.data;
});

// Get Area by ID
export const getAreaById = createAsyncThunk('location/getAreaById', async (id) => {
  const res = await axios.get(`/areas/${id}`);
  return res.data;
});

// Update Area
export const updateArea = createAsyncThunk('location/updateArea', async ({ id, data }) => {
  const res = await axios.put(`/areas/${id}`, data);
  return res.data;
});

// Delete Area
export const deleteArea = createAsyncThunk('location/deleteArea', async (id) => {
  const res = await axios.delete(`/areas/${id}`);
  return res.data;
});

// ============================
// Localities
// ============================

// Fetch Localities
export const fetchLocalities = createAsyncThunk('location/fetchLocalities', async (id) => {
  console.log("callling time")
  const query = id
    ? id.cityId
      ? `?cityId=${id.cityId}`
      : `?areaId=${id.areaId}`
    : '';
  const res = await axios.get(`/localities${query}`);
  return res.data;
});

// Add Locality
export const addLocality = createAsyncThunk('location/addLocality', async (data) => {
  const res = await axios.post('/localities', data);
  return res.data;
});

// Get Locality by ID
export const getLocalityById = createAsyncThunk('location/getLocalityById', async (id) => {
  const res = await axios.get(`/localities/${id}`);
  return res.data;
});

// Update Locality
export const updateLocality = createAsyncThunk('location/updateLocality', async ({ id, data }) => {
  const res = await axios.put(`/localities/${id}`, data);
  return res.data;
});

// Delete Locality
export const deleteLocality = createAsyncThunk('location/deleteLocality', async (id) => {
  const res = await axios.delete(`/localities/${id}`);
  return res.data;
});

// ============================
// Locality Limits
// ============================

// Set Locality Limit
export const setLocalityLimit = createAsyncThunk('location/setLocalityLimit', async (data) => {
  const res = await axios.post('/setlocalities/limit', data);
  return res.data;
});

// Get Locality Limit
export const getLocalityLimit = createAsyncThunk('location/getLocalityLimit', async () => {
  const res = await axios.get('/setlocalities/limit');
  return res.data;
});

// Update Locality Limit
export const updateLocalityLimit = createAsyncThunk('location/updateLocalityLimit', async (payload) => {
  const res = await axios.put(`/setlocalities/limit/${payload.id}`, payload);
  return res.data;
});

// ============================
// Slice
// ============================
const locationSlice = createSlice({
  name: 'location',
  initialState: {
    cities: [],
    areas: [],
    localities: [],
    localityLimits: [],
    selectedCity: null,
    selectedArea: null,
    selectedLocality: null,
    selectedLocalityLimit: null,
    status: 'idle',
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload.formattedData;
      })
      .addCase(addCity.fulfilled, (state) => {
        state.message = '✅ City added successfully';
      })
      .addCase(updateCity.fulfilled, (state) => {
        state.message = '✅ City updated successfully';
      })
      .addCase(deleteCity.fulfilled, (state) => {
        state.message = '🗑️ City deleted successfully';
      })
      .addCase(getCityById.fulfilled, (state, action) => {
        state.selectedCity = action.payload.result;
      })

      // Areas
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.areas = action.payload.formattedData;
      })
      .addCase(addArea.fulfilled, (state) => {
        state.message = '✅ Area added successfully';
      })
      .addCase(updateArea.fulfilled, (state) => {
        state.message = '✅ Area updated successfully';
      })
      .addCase(deleteArea.fulfilled, (state) => {
        state.message = '🗑️ Area deleted successfully';
      })
      .addCase(getAreaById.fulfilled, (state, action) => {
        state.selectedArea = action.payload.result;
      })

      // Localities
      .addCase(fetchLocalities.fulfilled, (state, action) => {
        state.localities = action.payload.formattedData;
      })
      .addCase(addLocality.fulfilled, (state) => {
        state.message = '✅ Locality added successfully';
      })
      .addCase(updateLocality.fulfilled, (state) => {
        state.message = '✅ Locality updated successfully';
      })
      .addCase(deleteLocality.fulfilled, (state) => {
        state.message = '🗑️ Locality deleted successfully';
      })
      .addCase(getLocalityById.fulfilled, (state, action) => {
        state.selectedLocality = action.payload.result;
      })

      // Locality Limits
      .addCase(setLocalityLimit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(setLocalityLimit.fulfilled, (state) => {
        state.status = 'succeeded';
        state.message = '✅ Locality limit set successfully';
      })
      .addCase(setLocalityLimit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(getLocalityLimit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getLocalityLimit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.localityLimits = action.payload.limits.data;
      })
      .addCase(getLocalityLimit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(updateLocalityLimit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateLocalityLimit.fulfilled, (state) => {
        state.status = 'succeeded';
        state.message = '✅ Locality limit updated successfully';
      })
      .addCase(updateLocalityLimit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default locationSlice.reducer;
