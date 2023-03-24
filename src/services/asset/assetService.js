import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";

//Get Asset
const getAsset = async (body) => {
  return await axios.get(dev.backendURL + "assets/" + body.id, {
    headers: authHeader(),
  });
};

//Get All Assets
const getAssets = async () => {
  return await axios.get(dev.backendURL + "assets/", {
    headers: authHeader(),
  });
};

//Get Assets by publicKey
const getAssetByPublicKey = async (id) => {
  return await axios.get(dev.backendURL + "assets/user/" + id, {
    headers: authHeader(),
  });
};

//Create Assets
const createAsset = async (body) => {
  return await axios.post(dev.backendURL + "assets/create", body, {
    headers: authHeader(),
  });
};

const assetService = {
  getAsset,
  getAssets,
  createAsset,
  getAssetByPublicKey,
};

export default assetService;
