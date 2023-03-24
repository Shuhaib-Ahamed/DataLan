import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import SettingsScreen from "./SettingsScreen";
import Dashboard from "../marketplace/provider/Dashboard";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import AssetsScreen from "../marketplace/assets/AssetsScreen";
import AutoMLTrain from "../marketplace/buyer/AutoMLTraining";
import ModelsScreen from "../automl/ModelsScreen";
import NotFoundScreen from "../../static/pages/NotFoundScreen";
import RequestsScreen from "../marketplace/buyer/RequestsScreen";
import LoadingScreen from "../../static/pages/LoadingScreen";
import authService from "../../services/auth/authService";
import userService from "../../services/user/userService";
import ViewAssetScreen from "../marketplace/assets/ViewAssetScreen";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await userService.getCurrentUser();
        localStorage.setItem("user", JSON.stringify(user?.data?.data));
      } catch (error) {
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchUser();
    }
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <LoadingScreen />
      ) : (
        <React.Fragment>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/assets" element={<AssetsScreen />} />
            <Route path="/assets/:id" element={<ViewAssetScreen />} />
            <Route path="/training" element={<AutoMLTrain />} />
            <Route path="/requests" element={<RequestsScreen />} />
            <Route path="/models" element={<ModelsScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;
