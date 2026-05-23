import type { JwtPayload } from "jsonwebtoken";
import prisma from "../../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import {
  ApplicationStatus,
  PaymentStatus,
  Role,
} from "../../../generated/enums.js";
import config from "../../../config/index.js";
import { Stripe } from "stripe";

export const createPaymentIntentIntoDB = async (
  loggedUser: JwtPayload,
  applicationId: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: loggedUser.userId,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (user.role !== Role.EMPLOYER) {
    throw new AppError("Only employers can create payment intents!", 403);
  }

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new AppError("Application not found!", 404);
  }

  if (application.status !== ApplicationStatus.HIRED) {
    throw new AppError(
      "Payment can only be created for hired applications!",
      400,
    );
  }

  const stripe = new Stripe(config.stripe.secret_key as string);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(application.proposedBudget) * 100,
    currency: "usd",

    automatic_payment_methods: {
      enabled: true,
    },
  });

  const stripePaymentIntentId = paymentIntent.id;

  const paymentData = await prisma.payment.create({
    data: {
      applicationId: application.id,
      freelancerId: application.freelancerId,
      employerId: user.id,
      stripePaymentIntentId,
      amount: application.proposedBudget,
    },

    select: {
      applicationId: true,
      freelancer: {
        select: {
          name: true,
          email: true,
        },
      },
      amount: true,
    },
  });

  return { ...paymentData, clientSecret: paymentIntent.client_secret };
};

export const confirmPaymentIntoDB = async (
  loggedUser: JwtPayload,
  paymentIntentId: string,
) => {
  const paymentDetails = await prisma.payment.findFirst({
    where: {
      employerId: loggedUser.userId,
      stripePaymentIntentId: paymentIntentId,
    },
  });

  if (!paymentDetails) {
    throw new AppError("Payment record not found!", 404);
  }

  if (paymentDetails.status !== PaymentStatus.PENDING) {
    throw new AppError("This payment has already been processed!", 400);
  }

  const updateStatus = await prisma.payment.update({
    where: {
      stripePaymentIntentId: paymentIntentId,
    },

    data: {
      status: PaymentStatus.COMPLETED,
    },
  });

  return updateStatus;
};
