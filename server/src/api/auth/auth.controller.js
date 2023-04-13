import { success } from "../../utils/responseApi.js";
import authService from "./auth.service.js";

export default {
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body);

      success(res, 200, result);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  createAccount: async (req, res, next) => {
    try {
      const result = await authService.createAccount(req.body);
      success(res, 201, result);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
};
