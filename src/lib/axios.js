import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

let tokenRefreshed = false;

const getToken = () => localStorage.getItem("accessToken");

const buildHeaders = (token) => ({
  Authorization: `Bearer ${token || getToken()}`,
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
    (res?.status === 403 && message === "Invalid or expired token") ||
    (res?.status === 401 && message === "Invalid or expired token");

  if (!tokenRefreshed && isUnauthorized) {
    return await handleUnauthorized(retryFn, url, data, params);
  }
  console.error(
    "API Error:",
    error,
    isUnauthorized,
    message,
    tokenRefreshed,
    res
  );

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
      let payload = data;

      // If data contains files, convert to FormData
      if (data.hasFiles) {
        payload = new FormData();
        for (const key in data) {
          if (key === "hasFiles") continue;

          const value = data[key];

          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item instanceof File) {
                payload.append(`${key}`, item);
              } else {
                payload.append(`${key}`, JSON.stringify(item));
              }
            });
          } else if (value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value);
          }
        }
      }
      console.log("Payload for POST request:", payload);
      const response = await instance.post(url, payload, {
        params,
        headers: {
          ...buildHeaders(token),
          ...(data.hasFiles && { "Content-Type": "multipart/form-data" }),
        },
      });
      return response.data;
    } catch (error) {
      return await catchUnauthorized(error, Api.post, url, data, params);
    }
  },
  put: async (url, data = {}, params = {}, token = null) => {
    console.log(" data", data);
    try {
      let payload = data;

      if (data.hasFiles) {
        payload = new FormData();
        for (const key in data) {
          if (key === "hasFiles") continue; // skip helper flag

          const value = data[key];

          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item instanceof File) {
                payload.append(`${key}`, item);
              } else {
                payload.append(`${key}`, JSON.stringify(item));
              }
            });
          } else if (value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value);
          }
        }
      }
      console.log("payload", payload);
      const response = await instance.put(url, payload, {
        params,
        headers: {
          ...buildHeaders(token),
          ...(data.hasFiles && { "Content-Type": "multipart/form-data" }),
        },
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
    const refreshTokenData = localStorage.getItem("refreshToken");

    try {
      const response = await instance.post(
        "/admin/v1/auth/refresh-token",
        {}, // empty body if no data to send
        {
          headers: {
            Authorization: `Bearer ${refreshTokenData}`,
          },
        }
      );

      const accessToken = response.data?.token;
      const refreshToken = response.data?.refreshToken;
      const adminData = response.data?.adminData;
      if (accessToken && refreshToken) {
        // Store in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("adminData", JSON.stringify(adminData));

        // ✅ If you want to store in cookies instead of localStorage:
        // document.cookie = `accessToken=${accessToken}; path=/;`;
        // document.cookie = `refreshToken=${refreshToken}; path=/;`;
      }
      return { status: "authorized", token: accessToken };
    } catch (error) {
      if (error.response?.status === 403) {
        console.error(
          "Error refreshing token=====>:",
          error,
          error.response?.status
        );
        // ["accessToken", "refreshToken", "adminData"].forEach(
        //   localStorage.removeItem
        // );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminData");
        window.location.reload();
        return { status: "unauthorized" };
      }
      throw new Error(error);
    }
  },
};

export default Api;
