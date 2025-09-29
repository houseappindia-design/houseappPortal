import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { data } from 'react-router';

export const fetchUsers = createAsyncThunk(
  'users/fetchusers',
  async ({ page = 1, pageSize = 5,startDate, endDate}) => {
   let query = `?page=${page}&pageSize=${pageSize}`;
    if (startDate) query += `&startDate=${encodeURIComponent(startDate)}`;
    if (endDate) query += `&endDate=${encodeURIComponent(endDate)}`;
    const response = await axios.get(`admin/users${query}`);
    return response.data; // should include { data: [...], total: 50 }
  }
);


export const deleteUser=createAsyncThunk(
   'agents/deleteUser',
   async(id)=>{
     console.log(id)
      const response= await axios.delete(`admin/users-detail/${id}`)
     return response.data;
   }
)


const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: {
      data: [],
      total: 0,
    },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log(action.payload,"ghhh")
        state.users = action?.payload.data || {};
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      ;
  },
});

export default userSlice.reducer;
