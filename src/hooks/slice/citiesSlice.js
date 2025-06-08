import { createSlice } from "@reduxjs/toolkit";
import { mockCities } from "../../services/mockData";

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    cities: mockCities,
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
    addCity: (state, action) => {
      state.cities.push(action.payload);
    },
    updateCity: (state, action) => {
      const index = state.cities.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cities[index] = action.payload;
      }
    },
    deleteCity: (state, action) => {
      state.cities = state.cities.filter((c) => c.id !== action.payload);
    },
  },
});

export const { setLoading, setError, addCity, updateCity, deleteCity } =
  citiesSlice.actions;
export default citiesSlice.reducer;
