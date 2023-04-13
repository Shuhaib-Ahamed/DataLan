import Asset from "../models/asset.model.js";
import Requests from "../models/requests.model.js";
import User from "../models/user.model.js";
import { REQUEST_STATUS, STATE } from "../../utils/enums.js";
import { failed, success } from "../../utils/responseApi.js";

export default {
  //Buyer
  sendAssetRequest: async (req, res) => {
    const body = req.body;
    try {
      const { fromPublicKey, toPublicKey, assetId } = body;

      console.log("ASSET ID: ", assetId);
      //set request status
      body.status = REQUEST_STATUS.INREVIEW;

      const publicKeys = [toPublicKey, fromPublicKey];
      const users = await User.find({ publicKey: { $in: publicKeys } });

      const asset = await Asset.findOne({
        $and: [{ _id: assetId }, { publicKey: toPublicKey }],
      });

      if (users.length <= 1 || !asset) {
        return failed(res, 404, "User or Asset dose not exist!");
      }

      //save object in mongo
      const response = await new Requests({ ...body }).save();

      return success(res, 201, response);
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        return failed(res, 400, "Asset transfer is already on request!");
      } else return failed(res, 400, "Mongo Error!");
    }
  },

  getRequestById: async (req, res) => {
    const { id } = req.params;
    try {
      const request = await Requests.findById(id);
      if (!request) return failed(res, 404, "Request not found!!!");
      return success(res, 200, request);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  acceptAssetRequest: async (req, res) => {
    const { id } = req.params;
    const { assetId } = req.body;
    try {
      await Requests.findByIdAndUpdate(
        id,
        {
          $set: {
            status: REQUEST_STATUS.GRANTED,
            assetId: assetId,
          },
        },
        { new: true }
      );
      return success(res, 204);
    } catch (error) {
      return failed(res, 400, "Failed to update request!");
    }
  },

  getSentRequests: async (req, res) => {
    const { id } = req.params;
    try {
      const requests = await Requests.find({ fromPublicKey: id }).sort({
        $natural: -1,
      });
      return success(res, 200, requests);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  getIncomingRequests: async (req, res) => {
    const { id } = req.params;
    try {
      const requests = await Requests.find({ toPublicKey: id }).sort({
        $natural: -1,
      });
      return success(res, 200, requests);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
};
