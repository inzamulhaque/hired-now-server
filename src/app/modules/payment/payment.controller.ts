import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  confirmPaymentIntoDB,
  createPaymentIntentIntoDB,
} from "./payment.srvice.js";

export const createPaymentIntent = catchAsync(async (req, res) => {
  const user = req.user!;
  const { applicationId } = req.params;

  const result = await createPaymentIntentIntoDB(user, applicationId as string);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Payment intent created successfully!",
    data: result,
  });
});

export const confirmPayment = catchAsync(async (req, res) => {
  const user = req.user!;
  const { paymentIntentId } = req.params;

  const result = await confirmPaymentIntoDB(user, paymentIntentId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment confirmed successfully!",
    data: result,
  });
});
