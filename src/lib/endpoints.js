const EndPoints = {
  getUser: "/admin/v1/auth",
  registerAdmin: "/admin/v1/auth/register",
  adminLogin: "admin/v1/auth/login",
  adminLogout: "/admin/v1/auth/logout",
  fetchAllStates: "/admin/v1/state/allState",
  createState: "/admin/v1/state/createState",
  updateState: "/admin/v1/state/updateStateById",
  deleteState: "/admin/v1/state/deleteStateById",
  fetchSingleState: "/admin/v1/state/getStateByID",
  generateAccessToken: "/admin/v1/auth/refresh-token",
  createCity: "/admin/v1/cities/createCity",
  fetchAllCities: "/admin/v1/cities/allCities",
  fetchSingleCity: "/admin/v1/cities/getCityByID",
  updateCity: "/admin/v1/cities/updateCityById",
  deleteCity: "/admin/v1/cities/deleteCityById",
  createPlace: "/admin/v1/places/createPlace",
  fetchAllPlaces: "/admin/v1/places/allPlaces",
  fetchSinglePlace: "/admin/v1/places/getPlaceByID",
  updatePlace: "/admin/v1/places/updatePlaceById",
  deletePlace: "/admin/v1/places/deletePlaceById",
  fetchAllFoods: "/admin/v1/foods/allFoods",
  createFood: "/admin/v1/foods/createFood",
  fetchSingleFood: "/admin/v1/foods/getFoodByID",
  updateFood: "/admin/v1/foods/updateFoodById",
  deleteFood: "/admin/v1/foods/deleteFoodById",

  //activity
  fetchAllActivities: "/admin/v1/activity/allActivities",
  createActivity: "/admin/v1/activity/createActivity",
  fetchSingleActivity: "/admin/v1/activity/getActivityByID",
  updateActivity: "/admin/v1/activity/updateActivityById",
  deleteActivity: "/admin/v1/activity/deleteActivityById",

  //hotels
  fetchAllHotels: "/admin/v1/hotels/allHotels",
  createHotel: "/admin/v1/hotels/createHotel",
  fetchSingleHotel: "/admin/v1/hotels/getHotelByID",
  updateHotel: "/admin/v1/hotels/updateHotelById",
  deleteHotel: "/admin/v1/hotels/deleteHotelById",

  //destination
  fetchAllDestinations: "/admin/v1/destination/allDestinations",
  createDestination: "/admin/v1/destination/createDestination",
  fetchSingleDestination: " /admin/v1/destination/getDestinationByID",
  updateDestination: "/admin/v1/destination/updateDestinationById",
  deleteDestination: "/admin/v1/destination/deleteDestinationById",

  //calender

  // Replace your existing calendar endpoints with these:

  fetchAllCalenders: "/admin/v1/calender",
  createCalender: "/admin/v1/calender/month",
  fetchSingleCalender: "/admin/v1/calender/month",
  updateCalender: "/admin/v1/calender/month",
  deleteCalender: "/admin/v1/calender/month",

  // Additional endpoints for state operations (optional)
  addStateToMonth: "/admin/v1/calender/month",
  removeStateFromMonth: "/admin/v1/calender/month",

  // Experience endpoints

  fetchAllExperiences: "/admin/v1/experience/allExperiences",
  createExperience: "/admin/v1/experience/createExperience",
  fetchSingleExperience: "/admin/v1/experience/getExperienceByID",
  updateExperience: "/admin/v1/experience/updateExperienceById",
  deleteExperience: "/admin/v1/experience/deleteExperienceById",
};

export default EndPoints;
