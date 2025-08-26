import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import env from "config/env";
import { Service } from "typedi";
import {
  validateFileType,
  getAllowedFileCondition,
} from "utils/presigned.utils";
import S3Service from "services/s3.service";
import { ObjectAcl } from "constants/enum";
import {
  GetPresignPostResponse,
  GetPresignUrlInput,
  GetPresignUrlResponse,
} from "./presigned.interface";

@Service()
export default class PresignService {
  private readonly s3Client!: S3Client;

  private readonly bucketName!: string;

  constructor() {
    this.s3Client = S3Service.getInstance();
    this.bucketName = env.aws.bucketName;
  }

  async getSignedUrl({
    fileName,
    fileType,
    metadata,
    accessControl = ObjectAcl.PUBLIC_READ,
  }: GetPresignUrlInput): Promise<GetPresignUrlResponse> {
    validateFileType(fileType);

    const params = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      ACL: accessControl,
      ContentType: fileType,
      Metadata: metadata,
    });

    const signedRequest = await getSignedUrl(this.s3Client, params, {
      expiresIn: env.preSign.expire,
    });

    return {
      signedRequest,
      cloudFrontURL: `${env.cloudFront.url}/${fileName}`,
    };
  }

  async getSignedPostUrl({
    fileName,
    fileType,
    metadata,
    accessControl = ObjectAcl.PUBLIC_READ,
  }: GetPresignUrlInput): Promise<GetPresignPostResponse> {
    validateFileType(fileType);
    const allowedFilesConditions = getAllowedFileCondition(fileType);

    const metadataHeaders: Record<string, string> = {};
    if (metadata) {
      Object.keys(metadata).forEach((key: string) => {
        metadataHeaders[`x-amz-meta-${key}`] = metadata[key]!;
      });
    }

    const signedUrl = await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: fileName,
      Conditions: [
        { acl: accessControl },
        [
          "content-length-range",
          env.preSign.minFileSize,
          env.preSign.maxFileSize,
        ],
        allowedFilesConditions.conditions,
      ],
      Fields: {
        acl: accessControl,
        "Content-Type": fileType,
        key: fileName,
        ...metadataHeaders,
      },
    });

    const presignData = {
      signedRequest: signedUrl,
      cloudFrontURL: `${env.cloudFront.url}/${fileName}`,
    };

    return presignData;
  }
}
