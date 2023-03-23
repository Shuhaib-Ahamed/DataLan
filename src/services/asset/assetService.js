import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";

//Get Asset
const getAsset = async (body) => {
  return await axios.get(dev.backendURL + "asset/" + body.id, {
    headers: authHeader(),
  });
};

//Get All Assets
const getAssets = async () => {
  return await axios.get(dev.backendURL + "asset/", {
    headers: authHeader(),
  });
};

//Create Assets
const createAsset = async (body) => {
  return await axios.post(dev.backendURL + "assets/create", body, {
    headers: authHeader(),
  });
};

// //Update User Role
// const updateUserRole = async (role) => {
//   return await axios.put(
//     dev.backendURL + "user/" + user._id + "/role",
//     {
//       role: role,
//     },
//     {
//       headers: authHeader(),
//     }
//   );
// };

// //Update User
// const updateUser = async (body) => {
//   return await axios.put(dev.backendURL + "user/" + user._id, body, {
//     headers: authHeader(),
//   });
// };

const assetService = {
  getAsset,
  getAssets,
  createAsset,
};

export default assetService;
