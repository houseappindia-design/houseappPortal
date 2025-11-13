import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import axioss  from 'axios';
const BASE_IMAGE_URL = import.meta.env.VITE_PRODUCTION_URL;

// Fetch agents
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
 async ({
  page = 1,
  pageSize = 5,
  locationId = null,
  city_id = null,
  area_id = null,
  startDate = null,
  endDate = null
}) => {
  try {
    const role = localStorage.getItem("role");
    const endpoint = role === "manager" ? "employee" : "admin";

    const params = {
      page,
      pageSize,
      ...(locationId && { locationId }),
      ...(city_id && { city_id }),
      ...(area_id && { area_id }),
      ...(startDate && endDate && { startDate, endDate }),
    };

    const response = await axios.get(`${endpoint}/agents`, { params });
    return response.data;

  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error.response?.data || error.message;
  }
}
);

// Update agent positions
export const UpdateAgentPostions = createAsyncThunk(
  'agents/UpdateAgentPostions',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(`admin/update-positions`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Something went wrong');
    }
  }
);

export  const addLocalityAPI =createAsyncThunk(
  'agents/addLocalityAPI',
  async (data, { rejectWithValue })=> {
      try {
        const response=await axios.post(`admin/add-agent-location`,data)
       console.log(response, "full axios response");
console.log(response.data, "response.data from add locality");
         return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message || 'Something went wrong');
      }
  }
)

export  const removeLocalityAPI =createAsyncThunk(
  'agents/removeLocalityAPI',
  async (data, { rejectWithValue })=> {
      try {
        const response=await axios.post(`admin/remove-agent-location`,data)
        console.log(response,"response from remove locality")
         return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message || 'Something went wrong');
      }
  }
)



export const UpdateAgentApi = createAsyncThunk(
  'agents/UpdateAgentApi',
  async ({ agent_id, data }, { rejectWithValue }) => {
    try {
      console.log(agent_id, data, "gggg");
      const response = await axioss.put(`${BASE_IMAGE_URL}/admin/agents/${agent_id}`, data,{
         headers: {
    'Content-Type': 'multipart/form-data',
  },
      });
      console.log(response, "response from update agent");
      return response.data;
    } catch (error) {
      // Defensive check in case error.response or message is missing
      const message = error.response?.data?.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

// export const fetchEmployeeLocalities = createAsyncThunk(
//   'agents/fetchEmployeeLocalities',
//   async ({ rejectWithValue }) => {
//     try {
//       debugger
//       const response = await axios.get("admin/employees-localities");
//       console.log(response,"response")
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message || 'Something went wrong');
//     }
//   }
// );

export const fetchEmployeeLocalities = createAsyncThunk(
  'agents/fetchEmployeeLocalities',
  async () => {
    const response = await axios.get("admin/employees-localities");
    return response.data;
  }
);


export const fetchAllUserReviews = createAsyncThunk(
  'agents/fetchAllUserReviews',
  async ({ page = 1, pageSize = 5 }) => {
    const response = await axios.get(`admin/reviews?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
);

export const getAgentDetail =createAsyncThunk(
  'agents/getAgentDetail',
  async(id)=>{
    const response= await axios.get(`admin/agent-detail/${id}`)
     return response.data;
  }
)

export const deleteAgent=createAsyncThunk(
   'agents/deleteAgent',
   async({agent_id})=>{
      const response= await axios.delete(`admin/agent-detail/${agent_id}`)
     return response.data;
   }
)

export const deleteReview=createAsyncThunk(
   'agents/deleteReview',
   async(id)=>{
     console.log(id)
      const response= await axios.delete(`admin/review/${id}`)
     return response.data;
   }
)


export const fetchAllUserPropertyRequests = createAsyncThunk(
  'agents/fetchAllUserPropertyRequests',
  async ({ page = 1, pageSize = 10 }) => {
    const response = await axios.get(
      `admin/get_property_requests`,
      {
        params: {
          page,
          limit: pageSize
        }
      }
    );

    return response.data; // ye reducer me jayega
  }
);




const agentSlice = createSlice({
  name: 'agents',
  initialState: {
    agents: [],
    reviews: [],
    expertHelpData: [],
    agentDetail:null,
    total: 0,
    limit: 10,
    totalPages: 0,
    page: 0,
    totalPages:0,
    loading: false,
    error: null,
    message: null, // to store success/error messages
  },
  extraReducers: (builder) => {
    builder
      // FETCH AGENTS
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        console.log(action.payload,"game game baj gya")
        state.agents = action.payload?.data?.data,
        state.total = action.payload?.data?.pagination?.total,
        state.limit=action.payload?.data?.pagination?.pageSize
        state.totalPages=action.payload?.data?.pagination?.totalPages,
        state.page=action.payload?.data?.pagination?.page,
        state.loading = false;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // UPDATE POSITIONS
      .addCase(UpdateAgentPostions.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(UpdateAgentPostions.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Positions updated successfully';
      })
      .addCase(UpdateAgentPostions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update agent positions';
      })

      .addCase(fetchEmployeeLocalities.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(fetchEmployeeLocalities.fulfilled, (state, action) => {
        console.log(action.payload.result.data, "7404401816")
        state.loading = false;
        state.agents = action.payload.result.data;
      })
      .addCase(fetchEmployeeLocalities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update agent positions';
      })
      .addCase(fetchAllUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserReviews.fulfilled, (state, action) => {
        const { reviews, total, page, limit, totalPages } = action.payload.result;
        state.loading = false;
        state.reviews = reviews;
        state.total = total;
        state.page = page;
        state.limit = limit;
        state.totalPages = totalPages;
      })
      .addCase(fetchAllUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
        .addCase(getAgentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.agentDetail = action.payload.data;
      })
      .addCase(getAgentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(deleteAgent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteAgent.fulfilled, (state, action) => {
      state.loading = false;
      // Optionally remove agent from list if using local state
      state.agents = state.agents.filter(agent => agent.id !== action.meta.arg);
    })
    .addCase(deleteAgent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete agent';
    })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.reviews = state.reviews.filter(review => review.id !== deletedId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
            // FETCH PROPERTY REQUESTS (Expert Help Requests)
      .addCase(fetchAllUserPropertyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserPropertyRequests.fulfilled, (state, action) => {
        state.loading = false;
          console.log(action.payload,"expet hepl")
        state.expertHelpData = action.payload.data || []; // Array of requests
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchAllUserPropertyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch property requests";
      })


  },
});

export default agentSlice.reducer;
