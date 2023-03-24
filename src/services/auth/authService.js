import axios from "axios";
import { dev } from "../../config";
import jwt from "jsonwebtoken";

const register = (username, email, password) => {
  return axios.post(
    dev.backendURL + "auth/account/create",
    {
      username,
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const login = async (email, password) => {
  const { data } = await axios.post(
    dev.backendURL + "auth/login",
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (data.data.token) {
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem("token", data.data.token);
    return data.data.user;
  } else throw new Error(data.data.message);
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const authService = {
  register,
  login,
  logout,
  decodeToken,
};

export default authService;
