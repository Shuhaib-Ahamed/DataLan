import { STATE } from "../../utils/enums.js";
import { failed, success } from "../../utils/responseApi.js";
import Asset from "../models/asset.model.js";
import jwt from "jsonwebtoken";

export default {
  createAsset: async (req, res) => {
    const { assetTitle } = req.body;

    try {
      const assetByTitle = await Asset.findOne({ assetTitle });

      if (assetByTitle) {
        return failed(res, 400, "Asset already exists");
      }

      await new Asset(req.body).save();
      return success(res, 201);
    } catch (error) {
      console.log(error);
      return failed(res, 500, error);
    }
  },

  updateAsset: async (req, res) => {
    const { id } = req.params;
    try {
      const update = await Asset.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      if (!update) return failed(res, 404, "Asset not found!!!");
      return success(res, 200);
    } catch (error) {
      console.log(error);
      return failed(res, 500, error);
    }
  },

  getAssets: async (req, res) => {
    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token);

    try {
      const assets = await Asset.find({
        publicKey: { $ne: decoded.publicKey },
        originalId: null,
        status: STATE.OWNED,
      })
        .select(["-assetData", "-encryptionType"])
        .sort({ $natural: -1 });
      return success(res, 200, assets);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  getAssetByPublicKey: async (req, res) => {
    const { id } = req.params;
    try {
      const assets = await Asset.find({ publicKey: id }).sort({ $natural: -1 });
      return success(res, 200, assets);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  getAsset: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return failed(res, 404, "ID not found!!!");
      }

      const asset = await Asset.findById(id);

      if (!asset) {
        return failed(res, 404, "Asset not found!!!");
      }

      return success(res, 200, asset);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  getAssetByOriginalId: async (req, res) => {
    const { id } = req.params;
    const { userPublicKey } = req.body;

    console.log(id, userPublicKey);
    try {
      if (!id) {
        return failed(res, 404, "ID not found!!!");
      }

      const asset = await Asset.find({
        originalId: id,
        status: STATE.TRANSFERED,
        publicKey: userPublicKey,
      });

      if (!asset) {
        return failed(res, 404, "Asset not found!!!");
      }

      return success(res, 200, asset);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
};
