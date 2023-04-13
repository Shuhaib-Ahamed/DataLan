import axios from "axios";
import { devNGROCK } from "../../config";

//Get Current User
const getTransactionById = async (txID) => {
  return await axios.get(devNGROCK.setllarURL + "/transactions/" + txID);
};

//Get Current User
const getAccountById = async (publicKey) => {
  return await axios.get(devNGROCK.setllarURL + "/accounts/" + publicKey);
};

const stellarService = {
  getTransactionById,
  getAccountById,
};

export default stellarService;
