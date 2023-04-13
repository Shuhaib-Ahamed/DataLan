import mongoose from "mongoose";
import { STATE } from "../../utils/enums.js";

const assetSchema = mongoose.Schema(
  {
    publicKey: {
      type: String,
      required: "Public Key is required",
      trim: true,
    },
    assetTitle: {
      type: String,
      required: "Asset Title is required",
      trim: true,
  
    },
    assetData: {
      type: String,
      required: "Asset Data is required",
    },
    assetPrice: {
      type: Number,
      required: "Asset Price is required",
    },

    // state: {
    //   type: String,
    //   enum: STATE,
    //   default: STATE.OWNED,
    //   required: true,
    // },
    isVerified: {
      type: Boolean,
      default: false,
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
