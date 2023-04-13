import assetService from "./asset.service.js";

export default {
  getAssets: async (req, res, next) => {
    try {
      return await assetService.getAssets(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getAssetByPublicKey: async (req, res, next) => {
    try {
      return await assetService.getAssetByPublicKey(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getAsset: async (req, res, next) => {
    try {
      return await assetService.getAsset(req, res);
    } catch (error) {
      return next(error);
    }
  },

  getAssetByOriginalId: async (req, res, next) => {
    try {
      return await assetService.getAssetByOriginalId(req, res);
    } catch (error) {
      return next(error);
    }
  },

  createAsset: async (req, res, next) => {
    try {
      return await assetService.createAsset(req, res);
    } catch (error) {
      return next(error);
    }
  },

  updateAsset: async (req, res, next) => {
    try {
      return await assetService.updateAsset(req, res);
    } catch (error) {
      return next(error);
    }
  },

  deleteAsset: async (req, res, next) => {
    try {
      return await assetService.deleteAsset(req, res);
    } catch (error) {
      return next(error);
    }
  },
};
