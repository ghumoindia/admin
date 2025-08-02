import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

// Async thunk to fetch activities
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async () => {
    const response = await Api.get(EndPoints.fetchAllActivities);
    return response.activities;
  }
);

export const addActivity = createAsyncThunk(
  "activity/addActivity",
  async (newActivity) => {
    const response = await Api.post(EndPoints.createActivity, newActivity);
    return response || [];
  }
);

export const updateActivity = createAsyncThunk(
  "activity/updateActivity",
  async ({ id, data }) => {
    console.log("Activity updated id", id, "data", data);
    const response = await Api.put(`${EndPoints.updateActivity}/${id}`, data);
    console.log("Activity updated:", response);
    return response;
  }
);

export const deleteActivity = createAsyncThunk(
  "activity/deleteActivity",
  async ({ id }) => {
    let result = await Api.delete(`${EndPoints.deleteActivity}/${id}`);
    return result;
  }
);

const ActivitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchActivities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        console.log("Activities fetched:", action.payload);
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addActivity
      .addCase(addActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        console.log("Activity added:", action.payload);
        state.loading = false;
        state.activities.push(action.payload.activity);
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updateActivity
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        console.log("Activity updated:", action.payload);
        state.loading = false;
        const index = state.activities.findIndex(
          (activity) => activity.id === action.payload.id
        );
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // deleteActivity
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        console.log("Activity deleted:", action.payload);
        state.loading = false;
        state.activities = state.activities.filter(
          (activity) => activity.id !== action.payload.id
        );
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ActivitySlice.reducer;
