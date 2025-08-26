import { Service } from "typedi";
import {
  S3Client,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandOutput,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandOutput,
  AbortMultipartUploadCommand,
  ListPartsCommand,
  ListPartsCommandOutput,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "config/env";
import { NotFoundError } from "routing-controllers";
import S3Service from "services/s3.service";
import { ObjectAcl } from "constants/enum";
import { errorMessages, successMessages } from "./constants/messages";

@Service()
export class MultipartUploadService {
  private readonly s3Client!: S3Client;

  constructor() {
    this.s3Client = S3Service.getInstance();
  }

  async initiateMultipartUpload({
    key,
    contentType,
    metadata,
    accessControl = ObjectAcl.PUBLIC_READ,
    contentDisposition,
  }: InitiateMultipartUpload): Promise<string> {
    const command = new CreateMultipartUploadCommand({
      Key: key,
      Bucket: env.aws.bucketName,
      ACL: accessControl,
      ContentType: contentType,
      ContentDisposition: contentDisposition,
      Metadata: metadata,
    });

    const { UploadId }: CreateMultipartUploadCommandOutput =
      await this.s3Client.send(command);

    if (!UploadId) {
      throw new NotFoundError(errorMessages.initiateMultipartUpload);
    }

    return UploadId;
  }

  async generatePresignedUrls({
    uploadId,
    totalParts,
    key,
  }: GeneratePresignedUrlsInput): Promise<GeneratePresignedUrlResponse[]> {
    const presignedUrlsPromises = [];
    for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
      const params = {
        Bucket: env.aws.bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
      };

      const url = getSignedUrl(this.s3Client, new UploadPartCommand(params), {
        expiresIn: env.multipart.expire,
      });

      presignedUrlsPromises.push(url);
    }

    const signedUrls = await Promise.all(presignedUrlsPromises);
    const presignedUrls = signedUrls.map((signedUrl, index) => ({
      signedUrl,
      PartNumber: index + 1,
    }));

    return presignedUrls;
  }

  async completeMultipartUpload({
    uploadId,
    parts,
    key,
  }: CompleteMultipartUploadInput): Promise<string> {
    const params = {
      Bucket: env.aws.bucketName,
      Key: key,
      MultipartUpload: { Parts: parts },
      UploadId: uploadId,
    };

    const command = new CompleteMultipartUploadCommand(params);
    const { Location }: CompleteMultipartUploadCommandOutput =
      await this.s3Client.send(command);

    if (!Location) {
      throw new NotFoundError(errorMessages.completeMultipartUpload);
    }

    return `${env.cloudFront.url}/${key}`;
  }

  async abortMultipartUpload({
    uploadId,
    key,
  }: AbortMultipart): Promise<string> {
    const params = {
      Bucket: env.aws.bucketName,
      Key: key,
      UploadId: uploadId,
    };
    const command = new AbortMultipartUploadCommand(params);
    await this.s3Client.send(command);

    return successMessages.abortMultipartUpload;
  }

  async listUploadedChunks({
    key,
    uploadId,
    maxParts,
    partNumberMarker,
  }: MultipartList): Promise<ListUploadParts> {
    const params = {
      Bucket: env.aws.bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumberMarker: partNumberMarker,
      MaxParts: maxParts,
    };

    const command = new ListPartsCommand(params);
    const { Parts, MaxParts, PartNumberMarker }: ListPartsCommandOutput =
      await this.s3Client.send(command);

    const parts =
      Parts?.map(({ ETag, PartNumber }) => ({
        ...(ETag && { ETag: JSON.parse(ETag) }),
        PartNumber,
      })) ?? [];

    return { parts, maxParts: MaxParts, partNumberMarker: PartNumberMarker };
  }
}
