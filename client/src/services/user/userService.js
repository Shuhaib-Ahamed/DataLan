import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";
import authService from "../auth/authService";

const user = authService.decodeToken(localStorage.getItem("token"));

//Get Current User
const getCurrentUser = async () => {
  return await axios.get(dev.backendURL + "user/" + user.id, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = async (role) => {
  return await axios.put(
    dev.backendURL + "user/" + user.id + "/role",
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
  return await axios.put(dev.backendURL + "user/" + user.id, body, {
    headers: authHeader(),
  });
};

//Update User
const updateUserByPublicKey = async (body, publicKey) => {
  return await axios.put(dev.backendURL + "user/publicKey/" + publicKey, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
  updateUserByPublicKey,
};

export default userService;
