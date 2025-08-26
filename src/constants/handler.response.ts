import env from "config/env";
import { StatusCodes } from "http-status-codes";
import { appErrorMessages } from "./message";

export const returnTimeOutError = (origin?: string): HandlerResponse => {
  return {
    statusCode: StatusCodes.REQUEST_TIMEOUT,
    body: JSON.stringify({ message: appErrorMessages.requestTimeOut }),
    headers: {
      "content-type": "application/json",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-origin":
        origin && env.allowedOrigins.includes(origin)
          ? origin
          : env.allowedOrigins[0]!,
      "access-control-allow-credentials": true,
    },
  };
};

export const setHandlerCors = (data: AnyType, origin?: string): void => {
  data.headers["access-control-allow-origin"] =
    origin && env.allowedOrigins.includes(origin)
      ? origin
      : env.allowedOrigins[0];
  data.headers["access-control-allow-credentials"] = true;
  data.headers["access-control-allow-methods"] = "GET, POST, OPTIONS";

  console.log("Handler CORS", data.headers);
};
