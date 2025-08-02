import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

// Async thunk to fetch hotels
export const fetchHotels = createAsyncThunk("hotel/fetchHotels", async () => {
  const response = await Api.get(EndPoints.fetchAllHotels);
  return response.hotels;
});

export const addHotel = createAsyncThunk("hotel/addHotel", async (newHotel) => {
  const response = await Api.post(EndPoints.createHotel, newHotel);
  return response || [];
});

export const updateHotel = createAsyncThunk(
  "hotel/updateHotel",
  async ({ id, data }) => {
    const response = await Api.put(`${EndPoints.updateHotel}/${id}`, data);
    return response;
  }
);

export const deleteHotel = createAsyncThunk(
  "hotel/deleteHotel",
  async ({ id }) => {
    const result = await Api.delete(`${EndPoints.deleteHotel}/${id}`);
    return result;
  }
);

const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    hotels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchHotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addHotel
      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels.push(action.payload.hotel);
      })
      .addCase(addHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateHotel
      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hotels.findIndex(
          (hotel) => hotel._id === action.payload._id
        );
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteHotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = state.hotels.filter(
          (hotel) => hotel._id !== action.payload.id
        );
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default hotelSlice.reducer;
