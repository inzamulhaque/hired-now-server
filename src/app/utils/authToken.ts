import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secretKey: jwt.Secret,
  expiresIn?: string,
): string => {
  return jwt.sign(jwtPayload as jwt.JwtPayload, secretKey, {
    expiresIn: expiresIn || "1d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: jwt.Secret) => {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Your session has expired!", 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token!", 401);
    }

    throw new AppError("Authentication failed!", 401);
  }
};
