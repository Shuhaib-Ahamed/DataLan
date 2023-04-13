import express from "express";
import controller from "./requests.controller.js";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  "/send",
  upload.fields(),
  authenticate,
  controller.sendAssetRequest
);

router.post(
  "/accept",
  upload.fields(),
  authenticate,
  controller.acceptAssetRequest
);

router.get("/sent/:id", authenticate, controller.getSentRequests);
router.get("/:id", authenticate, controller.getRequestById);
router.get("/incoming/:id", authenticate, controller.getIncomingRequests);
router.put("/accept/:id", authenticate, controller.acceptAssetRequest);

export default router;
