import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";

//Get Models
const getModelByID = async (id) => {
  return await axios.get(dev.backendURL + "models/byId" + id, {
    headers: authHeader(),
  });
};

//Get All Models
const getModels = async (publicKey) => {
  return await axios.get(dev.backendURL + "models/" + publicKey, {
    headers: authHeader(),
  });
};

//Create Models
const createModel = async (body) => {
  return await axios.post(dev.backendURL + "models/", body, {
    headers: authHeader(),
  });
};

const modelService = {
  getModelByID,
  getModels,
  createModel,
};

export default modelService;
