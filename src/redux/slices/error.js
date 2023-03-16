import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      return { error: action.payload };
    },
    clearError: () => {
      return { error: "" };
    },
  },
});

const { reducer, actions } = errorSlice;

export const { setError ,clearError } = actions
export default reducer;