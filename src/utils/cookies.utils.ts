import env from "config/env";
import { Response } from "express";

interface SetCookie {
  cookies: Record<string, AnyType>;
  response: Response;
  expires: Date;
}

export const setCookies = ({ response, cookies, expires }: SetCookie): void => {
  const { domain } = env;
  if (domain) {
    Object.entries(cookies).forEach(([key, value]) => {
      response.cookie(key, value, {
        httpOnly: true,
        secure: true,
        domain,
        sameSite: "strict",
        expires,
      });
    });
  }
};
