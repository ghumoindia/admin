// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

// Async thunk for login
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const response = await Api.post(EndPoints.adminLogin, credentials);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }
);

// Async thunk for signup
export const signupAdmin = createAsyncThunk(
  "auth/signupAdmin",
  async (adminData, thunkAPI) => {
    try {
      const response = await Api.post(EndPoints?.registerAdmin, adminData);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  }
);

export const logoutAdmin = createAsyncThunk("auth/logout", async (adminId) => {
  try {
    const response = await Api.post(EndPoints?.adminLogout, { adminId });
    console.log("Logout response:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error?.response?.data?.message || "Logout failed",
    };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload?.adminData || null;

        const response = action.payload;

        if (response?.success) {
          state.admin = response.data;
          console.log("Login successful:", response.data);
          const accessToken = response.data?.token;
          const refreshToken = response.data?.refreshToken;
          const adminData = response.data?.adminData;

          console.log("adminDAta:", adminData);

          if (accessToken && refreshToken) {
            // Store in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("adminData", JSON.stringify(adminData));

            // ✅ If you want to store in cookies instead of localStorage:
            // document.cookie = `accessToken=${accessToken}; path=/;`;
            // document.cookie = `refreshToken=${refreshToken}; path=/;`;
          }
        } else {
          state.error = response?.error || "Login failed";
        }
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup
      .addCase(signupAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAdmin.fulfilled, (state, action) => {
        console.log("Signup successful:", action.payload, action);
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(signupAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout

      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = null;

        const response = action.payload;

        if (response?.success) {
          console.log("Logout successful:", response.data);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("adminData");
        } else {
          state.error = response?.error || "Logout failed";
        }
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
