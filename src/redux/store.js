import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import errorReducer from "./slices/error";
import networkReducer from "./slices/network";
import modalReducer from "./slices/modal";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  error: errorReducer,
  network: networkReducer,
  modal: modalReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
