import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGallery as fetchGalleryAPI, fetchFeaturedGallery as fetchFeaturedGalleryAPI } from '../api/api';

export const fetchAllGallery = createAsyncThunk('gallery/fetchAll', async () => {
  const { data } = await fetchGalleryAPI();
  return data;
});

export const fetchFeaturedGalleryThunk = createAsyncThunk('gallery/fetchFeatured', async () => {
  const { data } = await fetchFeaturedGalleryAPI();
  return data;
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    all: [],
    featured: [],
    allStatus: 'idle',
    featuredStatus: 'idle',
  },
  reducers: {
    invalidateGallery(state) {
      state.allStatus = 'idle';
      state.featuredStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGallery.pending, (state) => { state.allStatus = 'loading'; })
      .addCase(fetchAllGallery.fulfilled, (state, action) => {
        state.allStatus = 'succeeded';
        state.all = action.payload || [];
      })
      .addCase(fetchAllGallery.rejected, (state) => { state.allStatus = 'failed'; })
      .addCase(fetchFeaturedGalleryThunk.pending, (state) => { state.featuredStatus = 'loading'; })
      .addCase(fetchFeaturedGalleryThunk.fulfilled, (state, action) => {
        state.featuredStatus = 'succeeded';
        state.featured = action.payload || [];
      })
      .addCase(fetchFeaturedGalleryThunk.rejected, (state) => { state.featuredStatus = 'failed'; });
  },
});

export const { invalidateGallery } = gallerySlice.actions;
export default gallerySlice.reducer;
