import { S3Event } from "aws-lambda";
import { sendWebhook } from "utils/webhook.utils";
import {
  HeadObjectCommand,
  HeadObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { encodeImageToBlurHash } from "api/documents/utils/blur-hash.utils";
import { errorMessages } from "api/documents/constants/messages";
import { loadFreshEnv } from "config/env";
import { NotAcceptableError } from "routing-controllers";
import { Readable } from "typeorm/platform/PlatformTools";
import { streamToBuffer } from "utils/buffer.utils";
import { appErrorMessages } from "constants/message";

let s3Client: S3Client | null;

const initialIzeS3Client = async () => {
  if (!s3Client) {
    const S3Service = await import("services/s3.service");
    s3Client = S3Service.default.getInstance();
  }

  return s3Client;
};

export const generateBlurHash = async (
  event: S3Event,
): Promise<GenerateBlurHashHandlerResponse> => {
  // Ensure environment is loaded before using it
  await loadFreshEnv();

  s3Client = await initialIzeS3Client();
  try {
    const { webhookCred } = await import("constants/app.constant");
    if (!webhookCred) {
      return;
    }

    const { Records } = event;
    let key = Records[0]?.s3.object.key as string;
    console.log(`blurHash request for key : ${key}`);

    key = decodeURIComponent(key);

    const env = await import("config/env");
    const headCommand = new HeadObjectCommand({
      Bucket: env.default.aws.bucketName,
      Key: key,
    });

    const { ContentType = "" }: HeadObjectCommandOutput =
      await s3Client.send(headCommand);

    if (!ContentType.includes("image")) {
      throw new NotAcceptableError(appErrorMessages.fileType("image"));
    }

    const command = new GetObjectCommand({
      Bucket: env.default.aws.bucketName,
      Key: key,
    });

    const response: GetObjectCommandOutput = await s3Client.send(command);
    const { Body } = response;

    if (Body instanceof Readable) {
      const data = await streamToBuffer(Body);

      const blurHash = await encodeImageToBlurHash(data);

      console.log(
        `blurHash generated successfully for key : ${key}, blurHash: ${blurHash}`,
      );

      await sendWebhook({ key, blurHash }, webhookCred);

      console.log(
        `blurHash sent successfully for key : ${key} to ${webhookCred.url}`,
      );

      return blurHash;
    }

    throw new NotAcceptableError(errorMessages.objectType);
  } catch (error) {
    console.log(`${JSON.stringify(error)}`);

    return (error as Error).message;
  }
};
