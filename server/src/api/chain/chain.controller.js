import chainFunctions from "../../utils/chainLogic.js";
import { success } from "../../utils/responseApi.js";
import chainService from "./chain.service.js";

export default {
  uploadAsset: async (req, res, next) => {
    try {
      const result = await chainService.upload(req);
      success(res, 200, result);
    } catch (error) {
      return next(error);
    }
  },

  transferAsset: async (req, res, next) => {
    try {
      const result = await chainService.transferAsset(req.body);
      success(res, 200, result);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  searchAndDecryptAsset: async (req, res, next) => {
    try {
      const result = await chainService.searchAndDecryptAsset(req);
      success(res, 201, result);
    } catch (error) {
      return next(error);
    }
  },
  searchAssetById: async (req, res, next) => {
    try {
      const result = await chainService.searchAssetById(req.body);
      success(res, 201, result);
    } catch (error) {
      return next(error);
    }
  },
  searchAssetByMetadata: async (req, res, next) => {
    try {
      const result = await chainService.searchAssetByMetadata(req.body);
      success(res, 201, result);
    } catch (error) {
      return next(error);
    }
  },

  decryptAssetObject: async (req, res, next) => {
    try {
      const result = await chainService.decryptAssetObject(req.body);
      success(res, 201, result);
    } catch (error) {
      return next(error);
    }
  },

  createAsset: async (req, res, next) => {
    try {
      const result = await chainFunctions.createAsset(req.body);
      success(res, 200, result);
    } catch (error) {
      return next(error);
    }
  },
};
