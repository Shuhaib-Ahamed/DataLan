import mongoose from "mongoose";
import { ENCRYPTION, STATE } from "../../utils/enums.js";

const assetSchema = mongoose.Schema(
  {
    publicKey: {
      type: String,
      required: "Public Key is required",
      trim: true,
    },
    txID: {
      type: String,
      required: "Transaction ID is required",
      unique: true,
    },
    txAssetID: {
      type: String,
      required: "TX Asset ID is required",
      unique: true,
    },
    assetTitle: {
      type: String,
      required: "Asset Title is required",
      trim: true,
      unique: true,
    },
    assetAmount: {
      type: String,
      required: "Asset Amount is required",
      trim: true,
    },
    assetDescription: {
      type: String,
      required: "Asset Description is required",
      trim: true,
    },
    assetData: {
      type: String,
      required: "Asset Data is required",
    },
    originalAssetId: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      required: "Asset size is required",
    },
    length: {
      type: String,
      required: "Asset length is required",
    },
    columns: {
      type: Array,
      required: "Asset columns is required",
    },
    status: {
      type: String,
      enum: STATE,
      default: STATE.OWNED,
      required: true,
    },
    encryptionType: {
      type: String,
      enum: ENCRYPTION,
      default: ENCRYPTION.AES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update state
// assetSchema.pre("save", function (next) {
//   const asset = this;

//   if (!asset.isModified("encryptionObject")) {
//     return next();
//   }

//   asset.state = STATE.TRANSFERD;
//   return next();
// });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
