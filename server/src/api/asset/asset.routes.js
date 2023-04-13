import express from "express";
import controller from "./asset.controller.js";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", authenticate, controller.getAssets);
router.get("/:id", authenticate, controller.getAsset);
router.post(
  "/original/:id",
  upload.fields(),
  authenticate,
  controller.getAssetByOriginalId
);
router.get("/user/:id", authenticate, controller.getAssetByPublicKey);
router.delete("/:id", authenticate, controller.deleteAsset);
router.post("/create", upload.fields(), authenticate, controller.createAsset);
router.put("/:id", upload.fields(), authenticate, controller.updateAsset);

export default router;
