import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EndPoints from "../../lib/endpoints";
import Api from "../../lib/axios";

export const fetchExperiences = createAsyncThunk(
  "experience/fetchExperiences",
  async () => {
    try {
      const result = await Api.get(EndPoints.fetchAllExperiences);
      console.log("Fetched experiences:", result);
      return result.experiences;
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw error;
    }
  }
);

export const addExperience = createAsyncThunk(
  "experience/addExperience",
  async (newExperience) => {
    try {
      const result = await Api.post(EndPoints.createExperience, newExperience);
      return result;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  }
);

export const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async ({ id, data }) => {
    try {
      const result = await Api.put(`${EndPoints.updateExperience}/${id}`, data);
      return result;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (experienceId) => {
    if (!experienceId) {
      throw new Error("Experience ID is required for deletion");
    }
    try {
      const result = await Api.delete(
        `${EndPoints.deleteExperience}/${experienceId}`
      );
      return result;
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  }
);

const experienceSlice = createSlice({
  name: "experience",
  initialState: {
    experiences: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.experiences.push(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.experiences.findIndex(
          (exp) => exp._id === action.payload._id
        );
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(
          (exp) => exp._id !== action.payload.id
        );
      });
  },
});

export default experienceSlice.reducer;
