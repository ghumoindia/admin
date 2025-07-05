import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./slice/statesSlice";
import citiesReducer from "./slice/citiesSlice";
import placesReducer from "./slice/placesSlice";
import foodsReducer from "./slice/foodSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    states: statesReducer,
    cities: citiesReducer,
    places: placesReducer,
    foods: foodsReducer,
    auth: authReducer,
  },
});

export default store;
