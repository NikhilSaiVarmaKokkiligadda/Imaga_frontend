import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://imaga.vercel.app/media";

// Upload Media
export const uploadMedia = createAsyncThunk("media/upload", async (formData, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  try {
    formData.append("userId", userId);
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch User Media
export const fetchMedia = createAsyncThunk("media/fetch", async (id, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete Media
export const deleteMedia = createAsyncThunk("media/delete", async (mediaId, { rejectWithValue }) => {
  const token = localStorage.getItem("token");

  try {
    await axios.delete(`${API_URL}/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return mediaId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create Media Slice
const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList.push(action.payload);
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList = state.mediaList.filter((media) => media._id !== action.payload);
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ **Fix: Export reducer as default**
export default mediaSlice.reducer;
