import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockCities } from "../../services/mockData";
import EndPoints from "../../lib/endpoints";
import Api from "../../lib/axios";

export const fetchCities = createAsyncThunk("cities/fetchCities", async () => {
  try {
    const result = await Api.get(EndPoints.fetchAllCities);

    return result.cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
});

export const addCity = createAsyncThunk("cities/addCity", async (newCity) => {
  const result = await Api.post(EndPoints.createCity, newCity);
  return result;
});

export const updateCity = createAsyncThunk(
  "cities/updateCity",
  async ({ id, data }) => {
    try {
      let result = await Api.put(`${EndPoints.updateCity}/${id}`, data);
      return result;
    } catch (error) {
      console.error("Error updating city:", error);
    }
  }
);

export const deleteCity = createAsyncThunk(
  "cities/deleteCity",
  async (cityId) => {
    try {
      const result = await Api.delete(`${EndPoints.deleteCity}/${cityId}`);

      return result;
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  }
);

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addCity
      .addCase(addCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action.payload.city);
      })
      .addCase(addCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateCity
      .addCase(updateCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.loading = false;
        console.log("city updated:", action.payload);
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteCity
      .addCase(deleteCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = state.cities.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default citiesSlice.reducer;
