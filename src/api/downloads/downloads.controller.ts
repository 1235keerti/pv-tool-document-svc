import {
  JsonController,
  Get,
  UseBefore,
  Res,
  QueryParam,
} from "routing-controllers";
import Container from "typedi";
import { Response } from "express";
import { Logger } from "lib/logger";
import { AuthValidator } from "middlewares/auth-validator.middleware";
import { setCookies } from "utils/cookies.utils";
import typeValidationMiddleware from "middlewares/type-validation.middleware";
import { ObjectKeyDto } from "types/app.dto";
import { RequestPartEnum } from "types/enum";
import responseUtils from "constants/response-utils";
import DownloadService from "./downloads.service";

let downloadService: DownloadService | null;

const initialIzeDownloadService = () => {
  if (!downloadService) {
    downloadService = Container.get(DownloadService);
  }

  return downloadService;
};

@UseBefore(AuthValidator)
@JsonController("/downloads")
export class DownloadController {
  private readonly logger: Logger;

  private readonly downloadService: DownloadService;

  constructor() {
    this.logger = new Logger("Downloads");
    this.downloadService = initialIzeDownloadService();
  }

  @UseBefore(typeValidationMiddleware(ObjectKeyDto, RequestPartEnum.Query))
  @Get("/signed-url")
  getObjectSignedUrl(
    @Res() resp: Response,
    @QueryParam("key") key: string,
  ): Response<CommonResponseType> {
    try {
      const data = this.downloadService.getCloudFrontSignedUrl(key);

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(typeValidationMiddleware(ObjectKeyDto, RequestPartEnum.Query))
  @Get("/signed-cookies")
  getCloudFrontSignedCookie(
    @Res() resp: Response,
    @QueryParam("key") key: string,
  ): Response<CommonResponseType> {
    try {
      const { expires, cookies } =
        this.downloadService.getSignedCloudFrontCookie(key);

      setCookies({
        response: resp,
        cookies,
        expires,
      });

      return responseUtils.success(resp, { data: { cookies } });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }
}
