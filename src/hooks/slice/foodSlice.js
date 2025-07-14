import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mockFoods } from "../../services/mockData";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

export const fetchFoods = createAsyncThunk("foods/fetchFoods", async () => {
  const response = await Api.get(EndPoints.fetchAllFoods);
  console.log("fetch places data:=======>", response);
  return response.foods || []; // Adjust based on your API response structure
});

export const addFood = createAsyncThunk("foods/addFood", async (newFood) => {
  const response = await Api.post(EndPoints.createFood, newFood);
  console.log("Food added:", response);
  return response;
});

export const updateFood = createAsyncThunk(
  "foods/updateFood",
  async ({ id, data }) => {
    console.log("Food updated id", id, "data", data);
    const response = await Api.put(`${EndPoints.updateFood}/${id}`, data);
    console.log("Food updated:", response);
    return response;
  }
);
export const deleteFood = createAsyncThunk("foods/deleteFood", async (id) => {
  console.log("Food deleted id", id);
  let result = await Api.delete(`${EndPoints.deleteFood}/${id}`);
  return result;
});
const foodsSlice = createSlice({
  name: "foods",
  initialState: {
    foods: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFoods
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        console.log("Foods fetched:", action.payload);
        state.foods = action.payload;
        state.loading = false;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        console.error("Error fetching foods:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

      // addFood
      .addCase(addFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFood.fulfilled, (state, action) => {
        console.log("Food added:", action.payload);
        state.loading = false;
        state.foods.push(action.payload.food);
      })
      .addCase(addFood.rejected, (state, action) => {
        console.error("Error adding food:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

      // updateFood
      .addCase(updateFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        console.log("Food updated:", action.payload);
        state.loading = false;
      })
      .addCase(updateFood.rejected, (state, action) => {
        console.error("Error updating food:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteFood
      .addCase(deleteFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        console.log("Food deleted:", action.payload);
        const index = state.foods.findIndex(
          (food) => food.id === action.payload.id
        );
        if (index !== -1) {
          state.foods.splice(index, 1);
        }
        state.loading = false;
      })
      .addCase(deleteFood.rejected, (state, action) => {
        console.error("Error deleting food:", action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default foodsSlice.reducer;
