import type { ZodObject } from "zod";
import catchAsync from "../utils/catchAsync.js";

const validateRequest = (schema: ZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
    });

    next();
  });
};

export default validateRequest;
