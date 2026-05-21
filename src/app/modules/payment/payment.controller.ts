import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createPaymentIntentIntoDB } from "./payment.srvice.js";

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
