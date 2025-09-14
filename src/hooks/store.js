import { configureStore } from "@reduxjs/toolkit";
import statesReducer from "./slice/statesSlice";
import citiesReducer from "./slice/citiesSlice";
import placesReducer from "./slice/placesSlice";
import foodsReducer from "./slice/foodSlice";
import authReducer from "./slice/authSlice";
import activityReducer from "./slice/activitySlice";
import HotelsReducer from "./slice/hotelsSlice";
import DestinationReducer from "./slice/destinationSlice";
import calenderReducer from "./slice/calenderSlice";
import Experiences from "./slice/experienceSlice";
import videoReducer from "./slice/videoSlice";
import wondersReducer from "./slice/wondersSlice";

export const store = configureStore({
  reducer: {
    states: statesReducer,
    cities: citiesReducer,
    places: placesReducer,
    foods: foodsReducer,
    auth: authReducer,
    activity: activityReducer,
    hotels: HotelsReducer,
    destination: DestinationReducer,
    calender: calenderReducer,
    experience: Experiences,
    video: videoReducer,
    wonders: wondersReducer,
  },
});

export default store;
