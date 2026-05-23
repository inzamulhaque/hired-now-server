import express from "express";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../generated/enums.js";
import { confirmPayment, createPaymentIntent } from "./payment.controller.js";

const router = express.Router();

router.post(
  "/create-payment-intent/:applicationId",
  auth(Role.EMPLOYER),
  createPaymentIntent,
);

router.patch("/confirm/:paymentIntentId", auth(Role.EMPLOYER), confirmPayment);

const PaymentRouters = router;
export default PaymentRouters;
