import modelService from "./models.service.js";

export default {
  createModel: async (req, res, next) => {
    try {
      return await modelService.createModel(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getModels: async (req, res, next) => {
    try {
      return await modelService.getModels(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getModelById: async (req, res, next) => {
    try {
      return await modelService.getModelById(req, res);
    } catch (error) {
      return next(error);
    }
  },
};
