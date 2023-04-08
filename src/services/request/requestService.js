import axios from "axios";
import { devNGROCK } from "../../config";

import authHeader from "../auth/auth-header";

//Get Assets by publicKey
//Get Assets by publicKey
const getSentRequests = async (id) => {
  return await axios.get(devNGROCK.backendURL + "request/sent/" + id, {
    headers: authHeader(),
  });
};

//Get Assets by publicKey
const getIncomingRequests = async (id) => {
  return await axios.get(devNGROCK.backendURL + "request/incoming/" + id, {
    headers: authHeader(),
  });
};

//Send Asset Request
const sendAssetRequest = async (body) => {
  return await axios.post(devNGROCK.backendURL + "request/send", body, {
    headers: authHeader(),
  });
};

//Get Request
const getRequestByID = async (id) => {
  return await axios.get(devNGROCK.backendURL + "request/" + id, {
    headers: authHeader(),
  });
};

//Send Asset Request
const acceptAndUpdateAssetRequest = async (id, body) => {
  return await axios.put(devNGROCK.backendURL + "request/accept/" + id, body, {
    headers: authHeader(),
  });
};

const requestService = {
  getSentRequests,
  sendAssetRequest,
  acceptAndUpdateAssetRequest,
  getIncomingRequests,
  getRequestByID,
};

export default requestService;
