import { createSlice } from "@reduxjs/toolkit";
import { mockPlaces } from "../../services/mockData";

const placesSlice = createSlice({
  name: "places",
  initialState: {
    places: mockPlaces,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addPlace: (state, action) => {
      state.places.push(action.payload);
    },
    updatePlace: (state, action) => {
      const index = state.places.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.places[index] = action.payload;
      }
    },
    deletePlace: (state, action) => {
      state.places = state.places.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setLoading, setError, addPlace, updatePlace, deletePlace } =
  placesSlice.actions;
export default placesSlice.reducer;
