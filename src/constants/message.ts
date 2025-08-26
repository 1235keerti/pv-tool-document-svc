export const appErrorMessages = {
  envNotSet: (key: string): string => `Environment variable ${key} is not set.`,
  envArraySet: (key: string): string =>
    `Environment variable ${key} Array is not set properly.`,
  resourceNotFound: "Resource Not Found.",
  requestTimeOut: "Request Timeout",
  fileSize: (size: number): string => `File size exceeds the ${size} MB limit.`,
  fileType: (type: string): string => `File type is not an ${type}.`,
  cloudFrontConfig:
    "CloudFront environment variables are not defined properly.",
  awsSecretNotSet: "Secret has no usable string or binary value.",
};
