import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestPartEnum } from "types/enum";
import { StatusCodes } from "http-status-codes";

function typeValidationMiddleware(
  type: AnyType,
  requestPart: RequestPartEnum,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const plain = req[requestPart];
    const invalidReqPart = Buffer.isBuffer(plain) || !plain;
    if (invalidReqPart) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `'${requestPart}' is Required` });

      return;
    }

    const instance = plainToInstance(type, plain);
    const errors: ValidationError[] = await validate(instance);

    if (errors.length > 0) {
      const message = errors
        .map(({ constraints }: ValidationError) =>
          constraints ? Object.values(constraints).join(", ") : "",
        )
        .join("; ");

      res.status(StatusCodes.BAD_REQUEST).json({ message });

      return;
    }

    next();
  };
}

export default typeValidationMiddleware;
