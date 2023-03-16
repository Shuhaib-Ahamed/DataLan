import axios from "axios";
import { ROLE } from "../../enum";
import authHeader from "../auth/auth-header";

const BACKEND_URL = "http://localhost:9000/api/v1/";

const user = localStorage.user;

const id = user?.id;

//Get Current User
const getCurrentUser = () => {
  return axios.get(BACKEND_URL + "user/" + id, {
    headers: authHeader(),
  });
};

//Update User Role
const updateUserRole = (roleNumber) => {
  return axios.put(
    BACKEND_URL + "user/" + { id } + "/role",
    {
      role: roleNumber === 0 ? ROLE.BUYER : ROLE.PROVIDER,
    },
    {
      headers: authHeader(),
    }
  );
};

//Update User
const updateUser = (body) => {
  return axios.put(BACKEND_URL + "user/" + { id }, body, {
    headers: authHeader(),
  });
};

const userService = {
  getCurrentUser,
  updateUserRole,
  updateUser,
};

export default userService;
