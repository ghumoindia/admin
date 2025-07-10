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
};

export default EndPoints;
