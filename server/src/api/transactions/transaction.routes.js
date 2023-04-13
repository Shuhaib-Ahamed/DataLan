import express from "express";
import authenticate from "../../middlewares/authenticate.js";
import controller from "./transaction.controller.js";

const router = express.Router();
router.post("/payments/", authenticate, controller.sendPayment);
router.get("/payments/:id", authenticate, controller.getAllPayments);
export default router;
