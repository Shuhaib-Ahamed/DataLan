import axios from "axios";
import { devNGROCK } from "../../config";

import authHeader from "../auth/auth-header";

//Get Asset
const getAssetByID = async (id) => {
  return await axios.get(devNGROCK.backendURL + "assets/" + id, {
    headers: authHeader(),
  });
};

//Get Asset By Original ID
const getAssetByOriginalId = async (id, body) => {
  return await axios.post(devNGROCK.backendURL + "assets/original/" + id, body, {
    headers: authHeader(),
  });
};

//Get All Assets
const getAssets = async () => {
  return await axios.get(devNGROCK.backendURL + "assets/", {
    headers: authHeader(),
  });
};

//Get Assets by publicKey
const getAssetByPublicKey = async (id) => {
  return await axios.get(devNGROCK.backendURL + "assets/user/" + id, {
    headers: authHeader(),
  });
};

//Create Assets
const createAsset = async (body) => {
  return await axios.post(devNGROCK.backendURL + "assets/create", body, {
    headers: authHeader(),
  });
};

const updateAsset = async (body, id) => {
  return await axios.put(devNGROCK.backendURL + "assets/" + id, body, {
    headers: authHeader(),
  });
};

const assetService = {
  getAssetByID,
  getAssets,
  createAsset,
  getAssetByPublicKey,
  getAssetByOriginalId,
  updateAsset,
};

export default assetService;
