import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

export const fetchHeroVideo = createAsyncThunk(
  "videos/fetchHeroVideo",
  async () => {
    const response = await Api.get(EndPoints.getHeroVideo);
    console.log("fetchHeroVideo response->", response);
    return response.video || null;
  }
);

export const uploadHeroVideo = createAsyncThunk(
  "videos/uploadHeroVideo",
  async (formData) => {
    const response = await Api.post(EndPoints.uploadHeroVideo, formData);
    return response;
  }
);

export const deleteVideoById = createAsyncThunk(
  "video/deleteVideoByID",
  async ({ id }) => {
    const response = await Api.post(`${EndPoints.deleteHeroVideo}/${id}`);
    return response;
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    video: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroVideo.fulfilled, (state, action) => {
        state.video = action.payload;
        state.loading = false;
      })
      .addCase(fetchHeroVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // uploadHeroVideo
      .addCase(uploadHeroVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadHeroVideo.fulfilled, (state, action) => {
        state.video = action.payload.video; // replace with latest uploaded
        state.loading = false;
      })
      .addCase(uploadHeroVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = state.video.filter(
          (video) => video._id !== action.payload.id
        );
      })
      .addCase(deleteVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default videoSlice.reducer;
