import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";



const user = JSON.parse(localStorage.getItem("user"));

//Get Current User
const getCurrentUser = async () => {
  return await axios.get(dev.backendURL + "user/" + user._id, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = async (role) => {
  return await axios.put(
    dev.backendURL+ "user/" + user._id + "/role",
    {
      role: role,
    },
    {
      headers: authHeader(),
    }
  );
};

//Update User
const updateUser = async (body) => {
  return await axios.put(dev.backendURL + "user/" + user._id, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
};

export default userService;
