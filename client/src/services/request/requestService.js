import axios from "axios";
import { dev  } from "../../config";

import authHeader from "../auth/auth-header";

//Get Assets by publicKey
const getSentRequests = async (id) => {
  return await axios.get(dev.backendURL + "request/sent/" + id, {
    headers: authHeader(),
  });
};

//Get Assets by publicKey
const getIncomingRequests = async (id) => {
  return await axios.get(dev.backendURL + "request/incoming/" + id, {
    headers: authHeader(),
  });
};

//Send Asset Request
const sendAssetRequest = async (body) => {
  return await axios.post(dev.backendURL + "request/send", body, {
    headers: authHeader(),
  });
};

//Get Request
const getRequestByID = async (id) => {
  return await axios.get(dev.backendURL + "request/" + id, {
    headers: authHeader(),
  });
};

//Send Asset Request
const acceptAndUpdateAssetRequest = async (id, body) => {
  return await axios.put(dev.backendURL + "request/accept/" + id, body, {
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
