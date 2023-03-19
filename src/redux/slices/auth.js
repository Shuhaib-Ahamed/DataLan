import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import AuthService from "../../services/auth/authService";
import { setError } from "./error";
import { NETWORK } from "../../enum";
import { setTestNet } from "./network";
import UserService from "../../services/user/userService";

const user = localStorage.user && JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(username, email, password);
      thunkAPI.dispatch(setTestNet(NETWORK.TESTNET));

      //for credentials
      thunkAPI.dispatch(setMessage(response.data.data.secretKey));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setError(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const user = await AuthService.login(email, password);
      return { user: user };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setError(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getUser = createAsyncThunk("auth/user", async (thunkAPI) => {
  try {
    const user = await UserService.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(user?.data?.data));
    return { user: user.data.data };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setError(message));
    return thunkAPI.rejectWithValue();
  }
});

export const logout = createAsyncThunk("auth/logout", () => {
  AuthService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },

    //login
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    //log out
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [getUser.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
