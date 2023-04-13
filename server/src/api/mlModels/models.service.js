import Model from "../models/model.model.js";
import { failed, success } from "../../utils/responseApi.js";

export default {
  //Buyer
  createModel: async (req, res) => {
    const body = req.body;

    try {
      if (!body) return failed(res, 500, "No body!!!");
      //save object in mongo
      const response = await new Model({ ...body }).save();

      return success(res, 201, response);
    } catch (error) {
      console.log(error);
      return failed(res, 400, "Mongo Error!");
    }
  },

  getModelById: async (req, res) => {
    const { id } = req.params;
    try {
      const request = await Model.findById(id);
      if (!request) return failed(res, 404, "Model not found!!!");
      return success(res, 200, request);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  getModels: async (req, res) => {
    const { id } = req.params;
    try {
      const models = await Model.find({ publicKey: id }).sort({
        $natural: -1,
      });
      return success(res, 200, models);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
};
