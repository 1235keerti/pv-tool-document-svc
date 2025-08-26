import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import env from "config/env";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { getAuthToken } from "utils/auth.utils";
import { errorMessages } from "../api/multipartUpload/constants/messages";

@Service()
export class AuthValidator implements ExpressMiddlewareInterface {
  async use(
    request: Request,
    response: Response,
    next: (err?: Error) => NextFunction,
  ): Promise<NextFunction | Response> {
    try {
      const token = getAuthToken(request);

      if (!token) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: errorMessages.unauthorized });
      }

      verify(token, env.auth.secretKey);

      return next();
    } catch (error) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: errorMessages.unauthorized });
    }
  }
}
