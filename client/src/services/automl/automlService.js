import axios from "axios";
import { dev } from "../../config";

import authHeader from "../auth/auth-header";

//Train Assets
const trainDataSet = async (body) => {
  return await axios.post(dev.fastAPIURL + "/train", body, {
    headers: { "Content-Type": "multipart/form-data;" },
  });
};

const autoMLService = {
  trainDataSet,
};

export default autoMLService;
