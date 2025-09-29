// src/data/slices/alertSlice.js
import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    open: false,
    message: '',
    severity: 'success', // default severity is success
  },
  reducers: {
    setAlert: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeAlert: (state) => {
      state.open = false;
    },
  },
});

export const { setAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
