import mongoose from "mongoose";
import { REQUEST_STATUS } from "../../utils/enums.js";

const requestsSchema = mongoose.Schema(
  {
    fromPublicKey: {
      type: String,
      required: "From Public Key is required",
      trim: true,
    },
    toPublicKey: {
      type: String,
      required: "To Public Key is required",
      trim: true,
    },
    assetId: {
      type: String,
      required: "Asset Object ID is required",
    },
    userData: {
      type: Object,
      required: "User Data is required",
    },
    status: {
      type: String,
      enum: REQUEST_STATUS,
      default: REQUEST_STATUS.INREVIEW,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Requests = mongoose.model("Requests", requestsSchema);

export default Requests;
