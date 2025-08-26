import {
  JsonController,
  Get,
  Post,
  UseBefore,
  Res,
  QueryParam,
  Body,
} from "routing-controllers";
import Container from "typedi";
import { Response } from "express";
import { Logger } from "lib/logger";
import { AuthValidator } from "middlewares/auth-validator.middleware";
import { BasicAuthValidator } from "middlewares/basic-auth.middleware";
import {
  ObjectKeyDto,
  ZipDocumentsDto,
  CheckZipStatusDto,
} from "types/app.dto";
import typeValidationMiddleware from "middlewares/type-validation.middleware";
import { RequestPartEnum } from "types/enum";
import responseUtils from "constants/response-utils";
import DocumentService from "./documents.service";

let documentService: DocumentService | null;

const initialIzeDocumentService = () => {
  if (!documentService) {
    documentService = Container.get(DocumentService);
  }

  return documentService;
};

@JsonController("/documents")
export class DocumentsController {
  private readonly logger: Logger;

  private readonly documentService: DocumentService;

  constructor() {
    this.logger = new Logger("Documents");
    this.documentService = initialIzeDocumentService();
  }

  @UseBefore(AuthValidator)
  @UseBefore(typeValidationMiddleware(ObjectKeyDto, RequestPartEnum.Query))
  @Get("/blur-hash")
  public async initiateMultipart(
    @Res() resp: Response,
    @QueryParam("key") key: string,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data = await this.documentService.generateBlurHash(key);

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(AuthValidator)
  @UseBefore(typeValidationMiddleware(ObjectKeyDto, RequestPartEnum.Query))
  @Get("/info")
  public async getObjectInfo(
    @Res() resp: Response,
    @QueryParam("key") key: string,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data = await this.documentService.getObjectInfo(key);

      return responseUtils.success(resp, { data });
    } catch (error) {
      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(BasicAuthValidator)
  @UseBefore(typeValidationMiddleware(ZipDocumentsDto, RequestPartEnum.Body))
  @Post("/zip")
  public async zipDocuments(
    @Res() resp: Response,
    @Body() request: ZipDocumentsDto,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data = await this.documentService.zipDocuments(
        request.files!,
        request.zipPath,
      );

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(BasicAuthValidator)
  @UseBefore(typeValidationMiddleware(ZipDocumentsDto, RequestPartEnum.Body))
  @Post("/zip/create")
  public async zipAsyncDocuments(
    @Res() resp: Response,
    @Body() request: ZipDocumentsDto,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data = await this.documentService.zipDocuments(
        request.files!,
        request.zipPath,
        true,
      );

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);
      console.log("Zip Create Error", {
        error: JSON.stringify(error, null, 2),
      });

      return responseUtils.error(resp, error);
    }
  }

  @UseBefore(AuthValidator)
  @UseBefore(typeValidationMiddleware(CheckZipStatusDto, RequestPartEnum.Query))
  @Get("/zip/status")
  public async checkZipStatus(
    @Res() resp: Response,
    @QueryParam("zipPath") zipPath: string,
  ): Promise<Response<CommonResponseType>> {
    try {
      const data = await this.documentService.checkZipStatus(zipPath);

      return responseUtils.success(resp, { data });
    } catch (error) {
      this.logger.error(`${error}`);

      return responseUtils.error(resp, error);
    }
  }
}
