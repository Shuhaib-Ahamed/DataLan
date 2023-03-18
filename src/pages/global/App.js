import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import AuthVerify from "../../common/authVerify";
import { logout } from "../../redux/slices/auth";

import SettingsScreen from "./SettingsScreen";
import Dashboard from "../marketplace/provider/Dashboard";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import AssetsScreen from "../marketplace/assets/AssetsScreen";
import AutoMLTrain from "../marketplace/buyer/AutoMLTraining";
import RequestsScreen from "../marketplace/RequestsScreen";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/assets" element={<AssetsScreen />} />
        <Route path="/training" element={<AutoMLTrain />} />
        <Route path="/requests" element={<RequestsScreen />} />
      </Routes>
      <AuthVerify logOut={logOut} />
    </React.Fragment>
  );
};

export default App;
