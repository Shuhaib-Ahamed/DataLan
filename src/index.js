import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import HomeScreen from "./pages/global/HomeScreen";
import LoginScreen from "./pages/global/LoginScreen";
import RegisterScreen from "./pages/global/RegisterScreen";

import "./index.css";
import store from "./context/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </main>
      </Router>
    </Provider>
  </React.StrictMode>
);
