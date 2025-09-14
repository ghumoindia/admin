import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

export const fetchWonders = createAsyncThunk(
  "wonders/fetchWonders",
  async () => {
    const result = await Api.get(EndPoints.getAllWonders);
    console.log("Fetched wonders:", result);
    return result.wonder || [];
  }
);

export const createWonders = createAsyncThunk(
  "wonders/createWonders",
  async (data) => {
    const result = await Api.post(EndPoints.createWonders, data);
    console.log("Created wonder:", result);
    return result;
  }
);

export const updateWonders = createAsyncThunk(
  "wonders/updateWonders",
  async ({ id, data }) => {
    const result = await Api.put(`${EndPoints.updateWonders}/${id}`, data);
    console.log("Updated wonder:", result);
    return result;
  }
);

export const deleteWonders = createAsyncThunk(
  "wonders/deleteWonders",
  async ({ id }) => {
    const result = await Api.delete(`${EndPoints.deleteWonders}/${id}`);
    console.log("Deleted wonder:", result);
    return result;
  }
);

const wonderSlice = createSlice({
  name: "wonders",
  initialState: {
    wonders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchWonders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWonders.fulfilled, (state, action) => {
        state.wonders = action.payload;
        state.loading = false;
      })
      .addCase(fetchWonders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // create
      .addCase(createWonders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWonders.fulfilled, (state, action) => {
        state.wonders.push(action.payload);
        state.loading = false;
      })
      .addCase(createWonders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateWonders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWonders.fulfilled, (state, action) => {
        const index = state.wonders.findIndex(
          (w) => w._id === action.payload._id
        );
        if (index !== -1) {
          state.wonders[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateWonders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteWonders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWonders.fulfilled, (state, action) => {
        state.wonders = state.wonders.filter(
          (w) => w._id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(deleteWonders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default wonderSlice.reducer;
