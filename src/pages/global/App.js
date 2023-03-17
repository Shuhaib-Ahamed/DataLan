import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AuthVerify from "../../common/authVerify";
import { logout } from "../../redux/slices/auth";

import SettingsScreen from "../../components/ui/SettingsScreen";
import Dashboard from "../marketplace/provider/Dashboard";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const App = () => {
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
      <AuthVerify logOut={logOut} />
    </React.Fragment>
  );
};

export default App;
