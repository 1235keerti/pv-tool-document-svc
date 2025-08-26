import { verify } from "jsonwebtoken";
import env from "config/env";

export const verifyToken = (token: string): AnyType => {
  try {
    return verify(token, env.auth.secretKey);
  } catch (error) {
    return null;
  }
};
