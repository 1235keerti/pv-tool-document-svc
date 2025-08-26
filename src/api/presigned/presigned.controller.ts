import {
  JsonController,
  UseBefore,
  Res,
  Get,
  QueryParams,
} from "routing-controllers";
import Container from "typedi";
import { Response } from "express";
import { AuthValidator } from "middlewares/auth-validator.middleware";
import { Logger } from "lib/logger";
import typeValidationMiddleware from "middlewares/type-validation.middleware";
import { RequestPartEnum } from "types/enum";
import { getQueryObject } from "utils/app.utils";
import responseUtils from "constants/response-utils";
import PresignService from "./presigned.service";
import { GetPresignUrlDto } from "./presigned.dto";
import { GetPresignUrlQuery } from "./presigned.interface";

let presignService: PresignService | null;

const initializePresignService = () => {
  if (!presignService) {
    presignService = Container.get(PresignService);
  }

  return presignService;
};

@UseBefore(AuthValidator)
@JsonController("/presigned")
export class PresignedController {
  private readonly logger: Logger;

  private readonly presignService: PresignService;

  constructor() {
    this.logger = new Logger("Presigned");
    this.presignService = initializePresignService();
  }

  @UseBefore(typeValidationMiddleware(GetPresignUrlDto, RequestPartEnum.Query))
  @Get()
  public async getSignedUrl(
    @Res() resp: Response,
    @QueryParams() reqQuery: GetPresignUrlQuery,
  ): Promise<Response<CommonResponseType>> {
    try {
      const { metadata: stringMetadata } = reqQuery;
      const metadata = getQueryObject("metadata", stringMetadata);
      const data = await this.presignService.getSignedUrl({
        ...reqQuery,
        metadata,
      });

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(typeValidationMiddleware(GetPresignUrlDto, RequestPartEnum.Query))
  @Get("/post")
  public async getSignedPostUrl(
    @Res() resp: Response,
    @QueryParams() reqQuery: GetPresignUrlQuery,
  ): Promise<Response<CommonResponseType>> {
    try {
      const { metadata: stringMetadata } = reqQuery;
      const metadata = getQueryObject("metadata", stringMetadata);

      const data = await this.presignService.getSignedPostUrl({
        ...reqQuery,
        metadata,
      });

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }
}
