import { configureStore } from '@reduxjs/toolkit';
import songsReducer from './songsSlice';
import galleryReducer from './gallerySlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    songs: songsReducer,
    gallery: galleryReducer,
    auth: authReducer,
  },
});

export default store;
