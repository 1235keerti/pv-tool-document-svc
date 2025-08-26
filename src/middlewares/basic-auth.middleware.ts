import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { Service } from "typedi";
import env from "config/env";
import { errorMessages } from "api/multipartUpload/constants/messages";

@Service()
export class BasicAuthValidator implements ExpressMiddlewareInterface {
  async use(
    request: Request,
    response: Response,
    next: (err?: Error) => NextFunction,
  ): Promise<NextFunction | Response> {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Basic ")) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: errorMessages.unauthorized });
      }

      const parts = authHeader.split(" ");
      if (parts.length !== 2) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: errorMessages.unauthorized });
      }

      // Get credentials from Basic Auth header
      const base64Credentials = parts[1] as string;
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii",
      );
      const [username, password] = credentials.split(":");

      if (!username || !password) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: errorMessages.unauthorized });
      }

      // Check against environment variables
      if (
        username !== env.auth.basicAuthUsername ||
        password !== env.auth.basicAuthPassword
      ) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: errorMessages.unauthorized });
      }

      return next();
    } catch (error) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: errorMessages.unauthorized });
    }
  }
}
