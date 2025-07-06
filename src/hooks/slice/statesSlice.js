import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mockStates } from "../../services/mockData";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

export const fetchStates = createAsyncThunk("states/fetchStates", async () => {
  const response = await Api.get(EndPoints.fetchAllStates);
  console.log("Fetched states:", response);
  return response;
});

// Add new state
export const createState = createAsyncThunk(
  "states/createState",
  async (stateData) => {
    const response = await Api.post(EndPoints.createState, stateData);
    console.log("State created:", response);
    return response;
  }
);

export const fetchSingleState = createAsyncThunk(
  "states/fetchSingleState",
  async (id) => {
    const response = await Api.get(`${EndPoints.fetchSingleState}/${id}`);
    return response.data;
  }
);

// Update state
export const updateStateById = createAsyncThunk(
  "states/updateState",
  async ({ id, data }) => {
    const response = await Api.put(`${EndPoints.updateState}/${id}`, data);
    return response.data;
  }
);

// Delete state
export const deleteStateById = createAsyncThunk(
  "states/deleteState",
  async (id) => {
    await Api.delete(`${EndPoints.deleteState}/${id}`);
    return id;
  }
);

const statesSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch all states
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        console.log("States fetched:", action.payload);
        state.loading = false;
        state.states = action.payload.states;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create state
      .addCase(createState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createState.fulfilled, (state, action) => {
        console.log("State created:", action.payload, action);
        state.loading = false;
        state.states.push(action.payload.state);
      })
      .addCase(createState.rejected, (state, action) => {
        console.error("Error creating state:", action.error);
        state.loading = false;
        state.error = action.error.message;
      })

      // Update state
      .addCase(updateStateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStateById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.states.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(updateStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete state
      .addCase(deleteStateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStateById.fulfilled, (state, action) => {
        state.loading = false;
        state.states = state.states.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default statesSlice.reducer;
