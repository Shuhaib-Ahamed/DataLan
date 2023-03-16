import axios from "axios";
import authHeader from "../auth/auth-header";

const BACKEND_URL = "http://localhost:9000/api/v1/";

//Get Current User
const getCurrentUser = (userID) => {
  return axios.get(BACKEND_URL + "user/" + userID, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = (userID, role) => {
  return axios.put(
    BACKEND_URL + "user/" + userID + "/role",
    {
      role: role,
    },
    {
      headers: authHeader(),
    }
  );
};

//Update User
const updateUser = (userID, body) => {
  return axios.put(BACKEND_URL + "user/" + userID, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
};

export default userService;
