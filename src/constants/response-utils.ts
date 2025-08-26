import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { appErrorMessages } from "./message";

class ResponseUtils {
  public success<T>(
    resp: Response,
    { data, status = StatusCodes.OK, message }: CommonResponseType<T>,
  ): Response<CommonResponseType<T>> {
    return resp.send({ data, message }).status(status);
  }

  public error(resp: Response, err: AnyType) {
    if (err.name === "NotFound") {
      return resp
        .status(StatusCodes.NOT_FOUND)
        .send({ message: appErrorMessages.resourceNotFound });
    }

    return resp
      .status(err.httpCode ?? StatusCodes.BAD_REQUEST)
      .send({ message: err.message });
  }
}

export default new ResponseUtils();
