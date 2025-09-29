import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// ✅ Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const role =localStorage.getItem("role")
    const request =role==="manager"?"employee":"admin"
    const response = await axios.get(`${request}/notifications`);
    console.log(response.data.notifications, 'Fetched Notifications');
    return response.data.notifications;
  }
);

// ✅ Approve a notification (agent_working_location or office_address)
export const approveNotification = createAsyncThunk(
  'notifications/approveNotification',
  async ({ id, source }) => {
    console.log({ id, source });
    const response = await axios.put(`admin/notifications/${id}/approve`, { source });
    console.log(response.data.notifications, 'Approved Notification');
    return response.data.notifications;
  }
);

export const declineNotification = createAsyncThunk(
  'notifications/declineNotification',
  async ({ id, source }) => {
    console.log({ id, source });
    const response = await axios.delete(`admin/notifications/${id}/decline`, { source });
    console.log(response.data.notifications, 'decline Notification');
    return response.data.notifications;
  }
);


// ✅ Fetch admin counts
export const fetchAdminCounts = createAsyncThunk(
  'notifications/fetchAdminCounts',
  async () => {
    const response = await axios.get('admin/count');
    console.log(response.data, 'Fetched Admin Counts');
    return response.data;
  }
);

// ✅ Fetch notification count details
export const getNotificationCount = createAsyncThunk(
  'notifications/getNotificationCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('admin/notifications/count');
      console.log(response.data, 'Fetched Notification Count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching notification count');
    }
  }
);

// ✅ Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    all: [],
    users: [],
    agents: [],
    todayUserLogin:[],
    todayAgentLogin:[],
    agentWorkingLocations: [],
    officeAddresses: [],
    counts: {}, // for fetchAdminCounts
    notificationcount: {}, // for getNotificationCount
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        console.log(action.payload,"jjjj")
        const allNotifications = action.payload 

        state.all = allNotifications;
        if (allNotifications.some(n => n.source === 'user')) {state.users = allNotifications.filter(n => n.source === 'user');}
        if (allNotifications.some(n => n.source === 'agent')) { state.agents = allNotifications.filter(n => n.source === 'agent');}
        state.agentWorkingLocations = allNotifications.filter(n => n.source === 'agent_working_location');
        state.officeAddresses = allNotifications.filter(n => n.source === 'office_address');
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Approve notification
      .addCase(approveNotification.fulfilled, (state, action) => {
        const updatedNotification = action.payload;

        if (updatedNotification.source === 'agent_working_location') {
          state.agentWorkingLocations = state.agentWorkingLocations.filter(
            item => item.entity_id !== updatedNotification.entity_id
          );
        }

        if (updatedNotification.source === 'office_address') {
          state.officeAddresses = state.officeAddresses.filter(
            item => item.entity_id !== updatedNotification.entity_id
          );
        }

        state.all = state.all.filter(
          item => item.entity_id !== updatedNotification.entity_id
        );
      })

      // ✅ Fetch admin counts
      .addCase(fetchAdminCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCounts.fulfilled, (state, action) => {
        console.log(action.payload.data.data, 'Admin Count Data');
        state.counts = action.payload.data.data;
        state.todayUserLogin=action.payload?.data?.data?.todayUserLogin||[],
        state.todayAgentLogin=action.payload?.data?.data?.todayAgentLogin||[]
        state.loading = false;
      })
      .addCase(fetchAdminCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Get notification count
      .addCase(getNotificationCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationCount.fulfilled, (state, action) => {
        console.log(action.payload,"kfkk")
        state.loading = false;
        state.notificationcount = action.payload?.data?.count || {};
        // state.todayUserLogin=action.payload?.data?.todayUserLogin,
        // state.todayAgentLogin=action.payload?.data?.todayAgentLogin
      })
      .addCase(getNotificationCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(declineNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(declineNotification.fulfilled, (state, action) => {
      state.loading = false;
      // Optionally update state.notifications by removing or updating declined notification
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.meta.arg.id
      );
    })
    .addCase(declineNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Something went wrong';
    });
      ;
  },
});

export default notificationSlice.reducer;
