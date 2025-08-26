import {
  JsonController,
  Post,
  Get,
  Body,
  QueryParams,
  UseBefore,
  Res,
} from "routing-controllers";
import Container from "typedi";
import { Response } from "express";
import { RequestPartEnum } from "types/enum";
import typeValidationMiddleware from "middlewares/type-validation.middleware";
import { Logger } from "lib/logger";
import { AuthValidator } from "middlewares/auth-validator.middleware";
import responseUtils from "constants/response-utils";
import { MultipartUploadService } from "./multipartUpload.service";
import {
  AbortMultipartDto,
  CompleteMultipartDto,
  InitiateMultipartDto,
  ListMultipartDto,
  PreSignDto,
} from "./multipart.dto";
import { errorMessages } from "./constants/messages";

let multipartService: MultipartUploadService | null;

const initialIzeMultipartUploadService = () => {
  if (!multipartService) {
    multipartService = Container.get(MultipartUploadService);
  }

  return multipartService;
};

@UseBefore(AuthValidator)
@JsonController("/multipart")
export class MultipartUploadController {
  private readonly logger: Logger;

  private readonly multipartUploadService: MultipartUploadService;

  constructor() {
    this.logger = new Logger("Multipart-Upload");
    this.multipartUploadService = initialIzeMultipartUploadService();
  }

  @UseBefore(
    typeValidationMiddleware(InitiateMultipartDto, RequestPartEnum.Body),
  )
  @Post("/initiate")
  public async initiateMultipart(
    @Res() resp: Response,
    @Body() reqBody: InitiateMultipartUpload,
  ): Promise<Response<CommonResponseType>> {
    try {
      const uploadId =
        await this.multipartUploadService.initiateMultipartUpload(reqBody);

      return responseUtils.success(resp, { data: { uploadId } });
    } catch (error) {
      this.logger.error(`${errorMessages.initiateMultipartUpload}, ${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(typeValidationMiddleware(PreSignDto, RequestPartEnum.Body))
  @Post("/presigned-urls")
  public async generatePresignedUrls(
    @Res() resp: Response,
    @Body() reqBody: GeneratePresignedUrlsInput,
  ): Promise<Response<CommonResponseType>> {
    try {
      const response =
        await this.multipartUploadService.generatePresignedUrls(reqBody);

      return responseUtils.success(resp, { data: { presignedUrls: response } });
    } catch (error) {
      this.logger.error(`${errorMessages.generatePresignedUrls}, ${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(
    typeValidationMiddleware(CompleteMultipartDto, RequestPartEnum.Body),
  )
  @Post("/complete")
  public async completeMultipart(
    @Res() resp: Response,
    @Body() reqBody: CompleteMultipartUploadInput,
  ): Promise<Response<CommonResponseType>> {
    try {
      const cloudFrontURL =
        await this.multipartUploadService.completeMultipartUpload(reqBody);

      return responseUtils.success(resp, { data: { cloudFrontURL } });
    } catch (error) {
      this.logger.error(`${errorMessages.completeMultipartUpload}, ${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(typeValidationMiddleware(AbortMultipartDto, RequestPartEnum.Body))
  @Post("/abort")
  public async abortMultipart(
    @Res() resp: Response,
    @Body() reqBody: AbortMultipart,
  ): Promise<Response<CommonResponseType>> {
    try {
      const response =
        await this.multipartUploadService.abortMultipartUpload(reqBody);

      return responseUtils.success(resp, { message: response });
    } catch (error) {
      this.logger.error(`${errorMessages.abortMultipartUpload}, ${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(typeValidationMiddleware(ListMultipartDto, RequestPartEnum.Query))
  @Get("/uploaded-chunks")
  public async listUploadedChunks(
    @Res() resp: Response,
    @QueryParams() reqQuery: MultipartList,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data =
        await this.multipartUploadService.listUploadedChunks(reqQuery);

      return responseUtils.success(resp, {
        data,
      });
    } catch (error) {
      this.logger.error(`${errorMessages.listUploadedChunks}, ${error}`);

      return responseUtils.error(resp, error);
    }
  }
}
