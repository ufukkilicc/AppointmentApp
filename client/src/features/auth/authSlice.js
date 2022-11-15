import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, { payload }) => {
      state.auth = payload;
    },
  },
});

export const { updateAuth } = authSlice.actions;

export const getAuth = (state) => state.auth.auth;

export default authSlice.reducer;
