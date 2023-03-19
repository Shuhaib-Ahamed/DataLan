import axios from "axios";
import { useDispatch } from "react-redux";
import authHeader from "../auth/auth-header";

const BACKEND_URL = "http://localhost:9000/api/v1/";

const user = JSON.parse(localStorage.getItem("user"));

//Get Current User
const getCurrentUser = async () => {
  return await axios.get(BACKEND_URL + "user/" + user._id, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = async (role) => {
  return await axios.put(
    BACKEND_URL + "user/" + user._id + "/role",
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
  return await axios.put(BACKEND_URL + "user/" + user._id, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
};

export default userService;
