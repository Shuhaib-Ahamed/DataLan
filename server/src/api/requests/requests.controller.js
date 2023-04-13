import requestService from "./requests.service.js";

export default {
  sendAssetRequest: async (req, res, next) => {
    try {
      return await requestService.sendAssetRequest(req, res);
    } catch (error) {
      return next(error);
    }
  },

  acceptAssetRequest: async (req, res, next) => {
    try {
      return await requestService.acceptAssetRequest(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getSentRequests: async (req, res, next) => {
    try {
      return await requestService.getSentRequests(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getIncomingRequests: async (req, res, next) => {
    try {
      return await requestService.getIncomingRequests(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getRequestById: async (req, res, next) => {
    try {
      return await requestService.getRequestById(req, res);
    } catch (error) {
      return next(error);
    }
  },
};
