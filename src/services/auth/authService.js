import axios from "axios";

const BACKEND_URL = "http://localhost:9000/api/v1/";

const register = (username, email, password) => {
  return axios.post(
    BACKEND_URL + "auth/account/create ",
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
    BACKEND_URL + "auth/login",
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

const authService = {
  register,
  login,
  logout,
};

export default authService;
