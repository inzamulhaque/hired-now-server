import jwt from "jsonwebtoken";

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
  return jwt.verify(token, secret) as jwt.JwtPayload;
};
