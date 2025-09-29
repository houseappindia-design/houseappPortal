import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import axioss from 'axios';
const BASE_IMAGE_URL = import.meta.env.VITE_PRODUCTION_URL;

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await axios.post('admin/login', credentials);
  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await axios.post('/Admin-logout');
  return response.data;
});

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwords, { rejectWithValue }) => {
    try {
      const response = await axios.post('/admin/change-password', passwords); // Adjust URL if needed
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);



// View admin profile
export const viewProfile = createAsyncThunk(
  'auth/viewProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/profile');
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Update admin profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    console.log(profileData, "profileData")
    const transformedData = {
      name: profileData.fullName,
      email: profileData.email,
    };
    try {
      const response = await axios.put('/admin/profile', transformedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);


export const createOrUpdateBankAccount = createAsyncThunk(
  'auth/createOrUpdateBankAccount',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axioss.post(`${BASE_IMAGE_URL}/admin/payment-details`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save bank account details');
    }
  }
);



export const getBankAccountDetails = createAsyncThunk(
  'auth/getBankAccountDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axioss.get(`${BASE_IMAGE_URL}/admin/payment-details`);
      console.log(response.data,"bakc")
      // Assuming you want only the first object from "result" array
      return response.data.data[0] || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank account details');
    }
  }
);

export const verifyAdminApi = createAsyncThunk(
  "admin/verifyAdminApi",
  async (password, { rejectWithValue }) => {
      console.log(password,"password from thunk")
    try {
      const { data } = await axios.post(`${BASE_IMAGE_URL}/admin/verify_password`, { password });
      console.log(data,"data from thunk")
      return data; // { success, message, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    message: null,
    user: null,
    token: null,
    status: 'idle',
    error: null,
    bankStatus: 'idle',     // <- new state for bank account
    bankError: null,
    bankSuccess: false,
    bankDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload?.tokens?.refresh?.token;
        state.message = action.payload.message || 'Login successful';
        localStorage.setItem('token', state.token);
         localStorage.setItem('role',action.payload.user.role)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.message = 'Logged out successfully';
        state.error = null;
        localStorage.removeItem('token');
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload.result.message)
        state.message = action.payload.result.message || '🔒 Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Password change failed';
      })
      // VIEW PROFILE
      .addCase(viewProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Adjust if response shape differs
        state.message = '✅ Profile fetched successfully';
        localStorage.setItem('role',action.payload.user.role)
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch profile';
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.result; // Assuming the updated user data is returned
        state.message = '✅ Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update profile';
      })
      .addCase(createOrUpdateBankAccount.pending, (state) => {
        state.bankStatus = 'loading';
        state.bankError = null;
        state.bankSuccess = false;
      })
      .addCase(createOrUpdateBankAccount.fulfilled, (state, action) => {
        state.bankStatus = 'succeeded';
        state.bankSuccess = true;
        state.bankError = null;
        // Optional: state.bankData = action.payload;
      })
      .addCase(createOrUpdateBankAccount.rejected, (state, action) => {
        state.bankStatus = 'failed';
        state.bankError = action.payload;
        state.bankSuccess = false;
      })

        // getBankAccountDetails cases
    .addCase(getBankAccountDetails.pending, (state) => {
      state.bankStatus = 'loading';
      state.bankError = null;
    })
    .addCase(getBankAccountDetails.fulfilled, (state, action) => {
      state.bankStatus = 'succeeded';
      state.bankDetails = action.payload;
      state.bankError = null;
    })
    .addCase(getBankAccountDetails.rejected, (state, action) => {
      state.bankStatus = 'failed';
      state.bankError = action.payload;
    })
    .addCase(verifyAdminApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(verifyAdminApi.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.data;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(verifyAdminApi.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = action.payload?.message || "Failed to verify admin";
        state.message = "";
      });

  }

});

export default authSlice.reducer;
