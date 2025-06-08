import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./slice/statesSlice";
import citiesReducer from "./slice/citiesSlice";
import placesReducer from "./slice/placesSlice";
import foodsReducer from "./slice/foodSlice";

export const store = configureStore({
  reducer: {
    states: statesReducer,
    cities: citiesReducer,
    places: placesReducer,
    foods: foodsReducer,
  },
});

export default store;
