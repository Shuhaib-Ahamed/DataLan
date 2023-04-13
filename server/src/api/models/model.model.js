import mongoose from "mongoose";

const modelSchema = mongoose.Schema(
  {
    classifier: {
      type: String,
      required: "Classifier is required",
    },
    params: {
      type: Object,
      required: "Params is required",
    },
    assetId: {
      type: String,
      required: "Model URL is required",
    },
    assetTitle: {
      type: String,
      required: "Dataset title is required",
    },
    publicKey: {
      type: String,
      required: "Model URL is required",
    },
    url: {
      type: String,
      required: "Model URL is required",
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("Model", modelSchema);

export default Model;
