import express from "express";
import controller from "./chain.controller.js";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  authenticate,
  controller.uploadAsset
);

router.post(
  "/transfer",
  upload.fields(),
  authenticate,
  controller.transferAsset
);

router.post(
  "/searchAndDecryptAsset",
  upload.single("file"),
  authenticate,
  controller.searchAndDecryptAsset
);

router.post(
  "/searchAssetById",
  upload.fields(),
  authenticate,
  controller.searchAssetById
);

router.post(
  "/searchAssetByMetadata",
  upload.fields(),
  authenticate,
  controller.searchAssetByMetadata
);

router.post(
  "/decryptAssetObject",
  upload.fields(),
  authenticate,
  controller.decryptAssetObject
);

router.post(
  "/sendAssetRequest",
  upload.fields(),
  authenticate,
  controller.sendAssetRequest
);

router.post(
  "/acceptAssetRequest",
  upload.fields(),
  authenticate,
  controller.acceptAssetRequest
);

export default router;
