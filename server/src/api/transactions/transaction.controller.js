import { success } from "../../utils/responseApi.js";
import authService from "./transaction.service.js";

export default {
  
  sendPayment: async (req, res, next) => {
    try {
      const result = await authService.sendPayment(req.body);
      success(res, 200, result);
    } catch (error) {
      return next(error);
    }
  },

  getAllPayments: async (req, res, next) => {
    try {
      const result = await authService.getAllPayments(req.params.id);
      success(res, 201, result);
    } catch (error) {
      return next(error);
    }
  },
};
