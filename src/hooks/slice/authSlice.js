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
      console.log("Response from signup:=>", response);
      return { success: true, data: response };
    } catch (error) {
      console.log("Response from signup:=> error run", error);
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload;

        if (response?.success) {
          state.admin = response.data;
          console.log("Login successful:", response.data);
          const accessToken = response.data?.token;
          const refreshToken = response.data?.refreshToken;

          if (accessToken && refreshToken) {
            // Store in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
