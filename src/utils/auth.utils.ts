import env from "config/env";
import { Request } from "express";

const getCookieToken = (headers: RequestHeaders): string | undefined => {
  const { cookie, Cookie } = headers;

  const list: Record<string, string> = {};
  const reqCookies = cookie ?? Cookie;

  reqCookies?.split(";").forEach((pair: string) => {
    const parts = pair.split("=");
    const key = parts.shift()?.trim() ?? "";
    const value = decodeURI(parts.join("="));
    if (key !== "") {
      list[key] = value;
    }
  });

  const values = env.auth.authCookieKeys
    .map((cookieName) => list[cookieName])
    .filter(Boolean);

  return values[0];
};

export const getAuthToken = (request: Request): string | undefined => {
  const cookieAuth = getCookieToken(request.headers);

  return cookieAuth ?? request.headers.authorization?.split(" ")[1];
};
