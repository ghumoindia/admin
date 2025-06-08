import { createSlice } from "@reduxjs/toolkit";
import { mockFoods } from "../../services/mockData";

const foodsSlice = createSlice({
  name: "foods",
  initialState: {
    foods: mockFoods,
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
    addFood: (state, action) => {
      state.foods.push(action.payload);
    },
    updateFood: (state, action) => {
      const index = state.foods.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.foods[index] = action.payload;
      }
    },
    deleteFood: (state, action) => {
      state.foods = state.foods.filter((f) => f.id !== action.payload);
    },
  },
});

export const { setLoading, setError, addFood, updateFood, deleteFood } =
  foodsSlice.actions;
export default foodsSlice.reducer;
