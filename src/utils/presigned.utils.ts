import { Conditions } from "@aws-sdk/s3-presigned-post/dist-types/types";
import { BadRequestError } from "routing-controllers";
import env from "config/env";
import { errorMessages } from "../api/presigned/constants/messages";

const allowedFileTypes = env.document.presignedUrlAllowedFileTypes;

interface AllowedFileCondition {
  conditions: Conditions;
  contentTypeField: string;
}

export const validateFileType = (fileType: string): boolean => {
  const checkFileAllowed = allowedFileTypes.find(
    (item) =>
      item.includes(fileType) || fileType.includes(item) || item === fileType,
  );

  if (!checkFileAllowed) {
    throw new BadRequestError(
      errorMessages.fileTypeError(`${allowedFileTypes}`),
    );
  }

  return true;
};

export const getAllowedFileCondition = (
  fileType: string,
): AllowedFileCondition => {
  const checkFileAllowed = allowedFileTypes.find(
    (item) =>
      item.includes(fileType) || fileType.includes(item) || item === fileType,
  );

  return {
    conditions: [
      "starts-with",
      "$Content-Type",
      checkFileAllowed,
    ] as Conditions,
    contentTypeField: checkFileAllowed ?? "",
  };
};
