import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

let tokenRefreshed = false;

const getToken = () => localStorage.getItem("accessToken");

const buildHeaders = (token) => ({
  Authorization: `Bearer ${token || getToken()}`,
  credentials: "include",
});

const handleUnauthorized = async (retryFn, url, data, params) => {
  tokenRefreshed = true;
  const { status, token } = await Api.generateToken();
  if (status !== "unauthorized") {
    tokenRefreshed = false;
    return retryFn(url, data, params, token);
  }
};

const catchUnauthorized = async (error, retryFn, url, data, params) => {
  const res = error?.response;
  const message = res?.data?.message;

  const isUnauthorized =
    res?.status === 401 &&
    [
      "Invalid token while matching the access token",
      "associated access token with user doesn't exists in database",
    ].includes(message);

  if (!tokenRefreshed && isUnauthorized) {
    return await handleUnauthorized(retryFn, url, data, params);
  }

  throw error;
};

const Api = {
  get: async (url, params = {}, token = null) => {
    try {
      const response = await instance.get(url, {
        params,
        headers: buildHeaders(token),
      });
      return response.data;
    } catch (error) {
      return await catchUnauthorized(error, Api.get, url, params);
    }
  },

  post: async (url, data = {}, params = {}, token = null) => {
    try {
      const response = await instance.post(url, data, {
        params,
        headers: buildHeaders(token),
      });

      return response.data;
    } catch (error) {
      return await catchUnauthorized(error, Api.post, url, data, params);
    }
  },

  put: async (url, data = {}, params = {}, token = null) => {
    try {
      const response = await instance.put(url, data, {
        params,
        headers: buildHeaders(token),
      });
      return response.data;
    } catch (error) {
      return await catchUnauthorized(error, Api.put, url, data, params);
    }
  },

  delete: async (url, params = {}, token = null) => {
    try {
      const response = await instance.delete(url, {
        params,
        headers: buildHeaders(token),
      });
      return response.data;
    } catch (error) {
      return await catchUnauthorized(error, Api.delete, url, params);
    }
  },

  generateToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const response = await instance.get("/admin/v1/auth/generate-access", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const { access_token, refresh_token } = response.data.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      return { status: "authorized", token: access_token };
    } catch (error) {
      if (error.response?.status === 401) {
        [
          "accessToken",
          "refreshToken",
          "confidentials",
          "activeDropdown",
          "activeMenuIndex",
        ].forEach(localStorage.removeItem);
        window.location.reload();
        return { status: "unauthorized" };
      }
      throw new Error(error);
    }
  },
};

export default Api;
