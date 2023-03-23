import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import store from "./redux/store";
import App from "./pages/global/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <main>
        <Router>
          <App />
        </Router>
        <ToastContainer position="bottom-right" />
      </main>
    </Provider>
  </React.StrictMode>
);

