import axios from "axios";
import authHeader from "../auth/auth-header";

const BACKEND_URL = "http://localhost:9000/api/v1/";

//Get Current User
const getCurrentUser = async (userID) => {
  return await axios.get(BACKEND_URL + "user/" + userID, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = async (userID, role) => {
  return await axios.put(
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
const updateUser = async (userID, body) => {
  return await axios.put(BACKEND_URL + "user/" + userID, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
};

export default userService;
