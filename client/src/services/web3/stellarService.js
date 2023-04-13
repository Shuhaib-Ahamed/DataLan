import axios from "axios";
import { dev } from "../../config";

//Get Current User
const getTransactionById = async (txID) => {
  return await axios.get(dev.setllarURL + "/transactions/" + txID);
};

//Get Current User
const getAccountById = async (publicKey) => {
  return await axios.get(dev.setllarURL + "/accounts/" + publicKey);
};

const stellarService = {
  getTransactionById,
  getAccountById,
};

export default stellarService;
