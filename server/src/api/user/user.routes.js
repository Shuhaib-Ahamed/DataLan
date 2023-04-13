import express from "express";
import controller from "./user.controller.js";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/:id", authenticate, controller.getUser);
router.put("/:id", upload.fields(), authenticate, controller.updateUser);
router.put(
  "/publicKey/:id",
  upload.fields(),
  authenticate,
  controller.updateUserByPublickey
);
router.put(
  "/:id/role",
  upload.fields(),
  authenticate,
  controller.updateUserRole
);

export default router;
