import { BadRequestError } from "routing-controllers";
import { appErrorMessages } from "constants/message";

export const ENVIRONMENT = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

export const getOsEnvArray = (
  key: string,
  required = false,
): string[] | undefined => {
  const value = process.env[key];
  if (value) {
    try {
      const array: string[] = JSON.parse(value);

      if (!Array.isArray(array) || !array.length) {
        throw new BadRequestError(appErrorMessages.envArraySet(key));
      }

      return array;
    } catch (error) {
      throw new BadRequestError((error as Error).message);
    }
  } else if (required) {
    throw new BadRequestError(appErrorMessages.envNotSet(key));
  }

  return undefined;
};

export const getOsEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new BadRequestError(appErrorMessages.envNotSet(key));
  }

  return value;
};

export const getOsEnvOptional = (key: string): string | undefined => {
  return process.env[key];
};

export const getOsEnvWithFeatureFlag = (
  key: string,
  featureFlag: string,
): string | undefined => {
  const feature = process.env[featureFlag];
  const value = process.env[key];

  if (feature === "true" && !value) {
    throw new BadRequestError(appErrorMessages.envNotSet(key));
  }

  return value;
};

export const toBool = (value?: string): boolean => {
  return value === "true";
};
