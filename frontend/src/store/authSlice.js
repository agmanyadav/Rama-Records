import { createSlice } from '@reduxjs/toolkit';

// Rehydrate from localStorage on init
const loadAuthFromStorage = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr && userInfoStr !== 'undefined' && userInfoStr !== 'null') {
      const parsed = JSON.parse(userInfoStr);
      return {
        user: parsed,
        token: parsed.token || null,
        role: parsed.role || (parsed.isAdmin ? 'admin' : 'user'),
        isAuthenticated: true,
      };
    }
  } catch (e) {
    // ignore parse errors
  }
  return { user: null, token: null, role: null, isAuthenticated: false };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    loginSuccess(state, action) {
      const data = action.payload;
      state.user = data;
      state.token = data.token;
      state.role = data.role || (data.isAdmin ? 'admin' : 'user');
      state.isAuthenticated = true;
      localStorage.setItem('userInfo', JSON.stringify(data));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
    updateProfile(state, action) {
      const updated = action.payload;
      state.user = { ...state.user, ...updated };
      localStorage.setItem('userInfo', JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
