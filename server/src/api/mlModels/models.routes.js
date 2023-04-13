import express from "express";
import controller from "./models.controller.js";
import multer from "multer";
import authenticate from "../../middlewares/authenticate.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/", upload.fields(), authenticate, controller.createModel);
router.get("/:id", authenticate, controller.getModels);
router.get("/byId/:id", authenticate, controller.getModelById);

export default router;
