import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSongs as fetchSongsAPI, fetchFeaturedSongs as fetchFeaturedSongsAPI } from '../api/api';

export const fetchAllSongs = createAsyncThunk('songs/fetchAll', async () => {
  const { data } = await fetchSongsAPI();
  return data;
});

export const fetchFeatured = createAsyncThunk('songs/fetchFeatured', async () => {
  const { data } = await fetchFeaturedSongsAPI();
  return data;
});

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    all: [],
    featured: [],
    allStatus: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    featuredStatus: 'idle',
  },
  reducers: {
    invalidateSongs(state) {
      state.allStatus = 'idle';
      state.featuredStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSongs.pending, (state) => { state.allStatus = 'loading'; })
      .addCase(fetchAllSongs.fulfilled, (state, action) => {
        state.allStatus = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.all = action.payload;
        }
      })
      .addCase(fetchAllSongs.rejected, (state) => { state.allStatus = 'failed'; })
      .addCase(fetchFeatured.pending, (state) => { state.featuredStatus = 'loading'; })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featuredStatus = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.featured = action.payload;
        }
      })
      .addCase(fetchFeatured.rejected, (state) => { state.featuredStatus = 'failed'; });
  },
});

export const { invalidateSongs } = songsSlice.actions;
export default songsSlice.reducer;
