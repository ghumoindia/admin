import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EndPoints from "../../lib/endpoints";
import Api from "../../lib/axios";

// Fetch all destinations
export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async () => {
    try {
      const result = await Api.get(EndPoints.fetchAllDestinations);
      return result.destinations;
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  }
);

// Add a destination
export const addDestination = createAsyncThunk(
  "destinations/addDestination",
  async (newDestination) => {
    const result = await Api.post(EndPoints.createDestination, newDestination);
    return result;
  }
);

// Update a destination
export const updateDestination = createAsyncThunk(
  "destinations/updateDestination",
  async ({ id, data }) => {
    try {
      const result = await Api.put(
        `${EndPoints.updateDestination}/${id}`,
        data
      );
      return result;
    } catch (error) {
      console.error("Error updating destination:", error);
    }
  }
);

// Delete a destination
export const deleteDestination = createAsyncThunk(
  "destinations/deleteDestination",
  async (destinationId) => {
    if (!destinationId) {
      throw new Error("Destination ID is required for deletion");
    }
    try {
      const result = await Api.delete(
        `${EndPoints.deleteDestination}/${destinationId}`
      );
      return result;
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  }
);

const destinationSlice = createSlice({
  name: "destinations",
  initialState: {
    destinations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addDestination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations.push(action.payload.destination);
      })
      .addCase(addDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update
      .addCase(updateDestination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.destinations.findIndex(
          (destiny) => destiny.id === action.payload.id
        );
        if (index !== -1) {
          state.destinations[index] = action.payload;
        }
        console.log("Destination updated:", action.payload);
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteDestination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = state.destinations.filter(
          (d) => d.id !== action.payload.id
        );
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default destinationSlice.reducer;
