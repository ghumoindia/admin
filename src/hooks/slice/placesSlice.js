import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mockPlaces } from "../../services/mockData";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

// Async thunks

export const fetchPlaces = createAsyncThunk("places/fetchPlaces", async () => {
  const response = await Api.get(EndPoints.fetchAllPlaces);

  return response.places; // Adjust based on your API response structure
});

export const addPlace = createAsyncThunk(
  "places/addPlace",
  async (newPlace) => {
    const response = await Api.post(EndPoints.createPlace, newPlace);
    console.log("Place added:", response);
    return response || []; // Adjust based on your API response structure
  }
);

export const updatePlace = createAsyncThunk(
  "places/updatePlace",
  async ({ id, data }) => {
    console.log("Place updated id", id, "data", data);
    const response = await Api.put(`${EndPoints.updatePlace}/${id}`, data);
    console.log("Place updated:", response);
    return response;
  }
);

export const deletePlace = createAsyncThunk(
  "places/deletePlace",
  async ({ id }) => {
    let result = await Api.delete(`${EndPoints.deletePlace}/${id}`);
    return result;
  }
);

// Slice

const placesSlice = createSlice({
  name: "places",
  initialState: {
    places: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetchPlaces
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        console.log("Places fetched:", action.payload);
        state.loading = false;
        state.places = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addPlace
      .addCase(addPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlace.fulfilled, (state, action) => {
        console.log("Place added:", action.payload);
        state.loading = false;
        state.places.push(action.payload.place);
      })
      .addCase(addPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updatePlace
      .addCase(updatePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.loading = false;
        console.log(" updated:", action.payload);
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deletePlace
      .addCase(deletePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places = state.places.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default placesSlice.reducer;
