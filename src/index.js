import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomeScreen from "./pages/global/HomeScreen";
import LoginScreen from "./pages/global/LoginScreen";
import RegisterScreen from "./pages/global/RegisterScreen";

import "./index.css";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </Router>
        <ToastContainer position="bottom-right" />
      </main>
    </Provider>
  </React.StrictMode>
);

// rm -r node_modules

// rm package-lock.json

// npm install
