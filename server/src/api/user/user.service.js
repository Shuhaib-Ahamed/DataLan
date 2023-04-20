import { failed, success } from "../../utils/responseApi.js";
import StellarSdk from "stellar-sdk";
import User from "../models/user.model.js";
const STELAR_API = "https://horizon-testnet.stellar.org";

var setllarServer = new StellarSdk.Server(STELAR_API);

export default {
  getUser: async (req, res) => {
    try {
      if (!req.params.id) {
        return failed(res, 404, "ID not found!!!");
      }

      const user = await User.findById(req?.params?.id);

      // Login successful, write token, and send back user
      const userData = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        isVerified: user?.isVerified,
        publicKey: user?.publicKey,
        role: user?.role,
        username: user?.username,
        data: user?.data,
      };

      if (!user) {
        return failed(res, 404, "User not found!!!");
      }
      return success(res, 200, userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      delete user.password;
      return success(res, 200, user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateUserByPublickey: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { publicKey: req.params.id },
        {
          $set: req.body,
        },
        { new: true }
      );

      delete user.password;
      return success(res, 200, user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const result = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { role: req.body.role },
        },
        { new: true }
      );
      return success(res, 201, result);
    } catch (error) {
      res.status(500).json(err);
    }
  },
};
