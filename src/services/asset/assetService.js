import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";

//Get Asset
const getAsset = async (id) => {
  return await axios.get(dev.backendURL + "assets/" + id, {
    headers: authHeader(),
  });
};

//Get Asset By Original ID
const getAssetByOriginalId = async (id, body) => {
  return await axios.post(dev.backendURL + "assets/original/" + id, body, {
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

const updateAsset = async (body, id) => {
  return await axios.put(dev.backendURL + "assets/" + id, body, {
    headers: authHeader(),
  });
};

const assetService = {
  getAssetByID: getAsset,
  getAssets,
  createAsset,
  getAssetByPublicKey,
  getAssetByOriginalId,
  updateAsset,
};

export default assetService;
