/* eslint-disable no-restricted-syntax */
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Service } from "typedi";
import env from "config/env";
import { NotAcceptableError } from "routing-controllers";
import S3Service from "services/s3.service";
import { streamToBuffer } from "utils/buffer.utils";
import archiver from "archiver";
import { v4 as uuidv4 } from "uuid";
import { Lambda } from "@aws-sdk/client-lambda"; // This line was already uncommented
import { Upload } from "@aws-sdk/lib-storage";
import { NodeJsRuntimeStreamingBlobPayloadOutputTypes } from "@smithy/types";
import { PassThrough, Readable } from "stream";
import { appErrorMessages } from "constants/message";
import { blurHashSizeLimit } from "constants/app.constant";
import { encodeImageToBlurHash } from "./utils/blur-hash.utils";
import {
  GenerateBlurHashResponse,
  GetObjectInfo,
  ZipDocumentsResponse,
} from "./documents.interface";
import { errorMessages } from "./constants/messages";

@Service()
export default class DocumentService {
  private readonly s3Client!: S3Client;

  private readonly lambdaClient: Lambda;

  private readonly bucketName!: string;

  constructor() {
    this.s3Client = S3Service.getInstance();
    this.bucketName = env.aws.bucketName;
    this.lambdaClient = new Lambda({
      region: env.aws.region,
    });
  }

  async generateBlurHash(key: string): Promise<GenerateBlurHashResponse> {
    const headCommand = new HeadObjectCommand({
      Bucket: env.aws.bucketName,
      Key: key,
    });

    const { ContentLength = 0, ContentType = "" }: HeadObjectCommandOutput =
      await this.s3Client.send(headCommand);

    if (ContentLength > blurHashSizeLimit) {
      throw new NotAcceptableError(appErrorMessages.fileSize(10));
    }

    if (!ContentType.includes("image")) {
      throw new NotAcceptableError(appErrorMessages.fileType("image"));
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response: GetObjectCommandOutput = await this.s3Client.send(command);
    const { Body } = response;

    if (Body instanceof Readable) {
      const data = await streamToBuffer(Body);

      const blurHash = await encodeImageToBlurHash(data);

      return {
        key,
        blurHash,
      };
    }

    throw new NotAcceptableError(errorMessages.objectType);
  }

  async getObjectInfo(key: string): Promise<GetObjectInfo> {
    const command = new HeadObjectCommand({
      Bucket: env.aws.bucketName,
      Key: key,
    });

    const {
      LastModified,
      ContentLength,
      ContentType,
      Metadata,
    }: HeadObjectCommandOutput = await this.s3Client.send(command);

    return {
      LastModified,
      ContentLength,
      ContentType,
      Metadata,
    };
  }

  async processZipInBackground(
    files: string[],
    zipKey: string,
    folderName: string,
    expirationDays: number,
  ): Promise<void> {
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
      store: false, // Do not store files without compression
    });

    // Create a pass-through stream that we'll write to S3
    const passThrough = new PassThrough();

    // Pipe archive data to the pass-through stream
    archive.pipe(passThrough);

    // Set up the S3 upload
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: zipKey,
        Body: passThrough,
        Expires: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
      },
    });

    try {
      // Process all files in parallel
      const fileProcessingPromises = files.map(async (key) => {
        try {
          const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          });

          const response = await this.s3Client.send(command);
          if (response.Body instanceof Readable) {
            const fileName = key.split("/").pop() || key;

            return {
              stream:
                response.Body as NodeJsRuntimeStreamingBlobPayloadOutputTypes,
              fileName: `${folderName}/${fileName}`,
            };
          }
          throw new Error(`Invalid response body for file: ${key}`);
        } catch (error) {
          throw new Error(
            `Failed to process file: ${key} - ${(error as AnyType).message}`,
          );
        }
      });

      // Wait for all files to be processed
      const results = await Promise.allSettled(fileProcessingPromises);

      // Check for any failures
      const failures = results.filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      );

      if (failures.length > 0) {
        const errorMessages = failures.map((f) => f.reason.message).join("; ");
        throw new Error(`Failed to process some files: ${errorMessages}`);
      }

      // Add all successful streams to the archive

      const successfulResults = results.filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          stream: NodeJsRuntimeStreamingBlobPayloadOutputTypes;
          fileName: string;
        }> => result.status === "fulfilled",
      );

      for (const result of successfulResults) {
        archive.append(result.value.stream, {
          name: result.value.fileName,
        });
      }

      // ✅ Ensure streaming completes after finalizing
      const streamingCompletedPromise = new Promise<void>((resolve, reject) => {
        passThrough.on("close", resolve); // Ensure ZIP stream is fully drained
        archive.on("error", reject);
      });

      // 🚀 Finalize the archive
      const finalizePromise = archive.finalize();

      // Start upload in parallel
      const uploadPromise = upload.done();

      // ✅ Wait for both archive finalization and streaming to complete
      await finalizePromise;
      await streamingCompletedPromise;
      await uploadPromise;

      console.log("✅ ZIP archive created and uploaded successfully!");
    } catch (error) {
      // Try to clean up the incomplete zip file
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: zipKey,
          }),
        );
      } catch (deleteError) {
        console.error(
          "[ZIP] Failed to delete incomplete zip file:",
          deleteError,
        );
      }
      throw new Error(`Failed to create zip file: ${error}`);
    }
  }

  async zipDocuments(
    files: string[],
    zipPath?: string,
    async?: boolean,
  ): Promise<ZipDocumentsResponse> {
    // Validate files array is not empty
    if (!files.length) {
      throw new NotAcceptableError(errorMessages.emptyFilesList);
    }

    // Check if number of files exceeds maximum limit
    if (files.length > env.documents.maxZipFiles) {
      throw new NotAcceptableError(
        errorMessages.maxFilesExceeded(env.documents.maxZipFiles),
      );
    }

    // Generate unique ID for the zip
    const zipId = uuidv4();

    // Create zip key using provided path or generate a random one
    const zipKey = zipPath
      ? `zips/${zipPath}/${zipId}.zip`
      : `zips/${zipId}.zip`;

    // Get the folder name from the zip key (without the .zip extension)
    const folderName = zipPath ? `${zipPath}_${zipId}` : zipId;

    console.log("[ZIP] Invoking zip processor lambda", { folderName, zipKey });
    // Invoke the zip processor lambda
    console.log(
      env.aws.zipProcessorFunction,
      "env.aws.zipProcessorFunction",
      env.documents.zipExpirationDays,
    );
    try {
      if (async) {
        await this.lambdaClient.invoke({
          FunctionName: env.aws.zipProcessorFunction,
          InvocationType: "Event", // Asynchronous invocation
          Payload: JSON.stringify({
            files,
            zipKey,
            folderName,
            expirationDays: env.documents.zipExpirationDays,
          }),
        });
      } else {
        await this.processZipInBackground(
          files,
          zipKey,
          folderName,
          env.documents.zipExpirationDays,
        );
      }
    } catch (error) {
      console.error("Failed to invoke zip processor lambda:", {
        error: JSON.stringify(error, null, 2),
      });
      throw new NotAcceptableError("Failed to start zip processing");
    }

    // Return immediately with the zip path
    return {
      zipPath: zipKey,
      status: async ? "pending" : "completed",
    };
  }

  async checkZipStatus(zipPath: string): Promise<ZipDocumentsResponse> {
    try {
      // Check if the file exists in S3
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: zipPath,
      });

      await this.s3Client.send(command);

      // If no error is thrown, the file exists
      return {
        zipPath,
        status: "completed",
      };
    } catch (error: AnyType) {
      if (error.$metadata?.httpStatusCode === 404) {
        // File doesn't exist yet
        return {
          zipPath,
          status: "pending",
        };
      }
      throw error;
    }
  }
}
