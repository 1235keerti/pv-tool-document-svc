import {
  ENVIRONMENT,
  getOsEnv,
  getOsEnvArray,
  getOsEnvOptional,
  getOsEnvWithFeatureFlag,
  toBool,
} from "lib/env/util";
import { config } from "dotenv";
import { MonitorRoute } from "constants/routes";
import { EnvConfig } from "./env.interfaces";

config();

/**
 * Environment variables From File
 */
export const getEnvFile = (): EnvConfig => {
  return {
    node: process.env.NODE_ENV ?? ENVIRONMENT.DEVELOPMENT,
    isProduction: process.env.NODE_ENV === ENVIRONMENT.PRODUCTION,
    isDevelopment: process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT,
    isDockerDeployment: toBool(getOsEnv("IS_DOCKER_DEPLOYMENT")),
    domain: getOsEnvOptional("CLIENT_DOMAIN"),
    port: +(getOsEnvOptional("PORT") ?? 4000),
    allowedOrigins: getOsEnvArray("ALLOWED_ORIGINS", true) ?? [],
    app: {
      name: getOsEnv("APP_NAME"),
      routePrefix: getOsEnv("APP_ROUTE_PREFIX"),
    },
    feature: {
      download: toBool(getOsEnvOptional("DOWNLOAD_FEATURE_FLAG")),
      multipart: toBool(getOsEnvOptional("MULTIPART_FEATURE_FLAG")),
      webhook: toBool(getOsEnvOptional("WEBHOOK_FEATURE_FLAG")),
    },
    log: {
      level: getOsEnv("LOG_LEVEL"),
    },
    swagger: {
      route: getOsEnv("SWAGGER_ROUTE"),
      username: getOsEnv("SWAGGER_USERNAME"),
      password: getOsEnv("SWAGGER_PASSWORD"),
    },
    monitor: {
      route: MonitorRoute.health,
      username: getOsEnv("SWAGGER_USERNAME"),
      password: getOsEnv("SWAGGER_PASSWORD"),
    },
    // sentry: {
    //   dsn: getOsEnv("SENTRY_DSN_URL"),
    // },
    aws: {
      accessKeyId: getOsEnvWithFeatureFlag(
        "APP_AWS_ACCESS_KEY_ID",
        "IS_DOCKER_DEPLOYMENT",
      ),
      secretAccessKey: getOsEnvWithFeatureFlag(
        "APP_AWS_SECRET_ACCESS_KEY",
        "IS_DOCKER_DEPLOYMENT",
      ),
      region: getOsEnvWithFeatureFlag("APP_AWS_REGION", "IS_DOCKER_DEPLOYMENT"),
      bucketName: getOsEnv("BUCKET_NAME"),
      zipProcessorFunction: getOsEnvOptional("ZIP_PROCESSOR_FUNCTION"),
    },
    preSign: {
      expire: +getOsEnv("PRESIGN_URL_EXPIRE"),
      minFileSize: +getOsEnv("FILE_MIN_SIZE"),
      maxFileSize: +getOsEnv("FILE_MAX_SIZE"),
    },
    // secretKey: getOsEnv("SECRET_KEY"),
    document: {
      presignedUrlAllowedFileTypes: getOsEnvArray("ALLOWED_FILE_TYPES") ?? [],
    },
    documents: {
      maxZipFiles: parseInt(getOsEnvOptional("MAX_ZIP_FILES") ?? "10", 10),
      zipExpirationDays: parseInt(
        getOsEnvOptional("ZIP_EXPIRATION_DAYS") ?? "7",
        10,
      ),
    },
    multipart: {
      expire: +(
        getOsEnvWithFeatureFlag(
          "PRESIGNED_MULTIPART_URL_EXPIRE",
          "MULTIPART_FEATURE_FLAG",
        ) ?? 0
      ),
    },
    auth: {
      secretKey: getOsEnv("SECRET_KEY"),
      basicAuthUsername: getOsEnv("BASIC_AUTH_USERNAME"),
      basicAuthPassword: getOsEnv("BASIC_AUTH_PASSWORD"),
      authCookieKeys: getOsEnvArray("AUTH_COOKIE_KEYS") ?? ["authToken"],
    },
    webhook: {
      secretKey: getOsEnvWithFeatureFlag(
        "WEBHOOK_SECRET_KEY",
        "WEBHOOK_FEATURE_FLAG",
      ),
      url: getOsEnvWithFeatureFlag("WEBHOOK_URL", "WEBHOOK_FEATURE_FLAG"),
    },
    cloudFront: {
      url: getOsEnv("CLOUDFRONT_URL"),
      privateKey: getOsEnvWithFeatureFlag(
        "CLOUDFRONT_PRIVATE_KEY",
        "DOWNLOAD_FEATURE_FLAG",
      ),
      keyPairId: getOsEnvWithFeatureFlag(
        "CLOUDFRONT_KEY_PAIR_ID",
        "DOWNLOAD_FEATURE_FLAG",
      ),
      signedExpire: +(
        getOsEnvWithFeatureFlag(
          "CLOUDFRONT_SIGNED_EXPIRE",
          "DOWNLOAD_FEATURE_FLAG",
        ) ?? 0
      ),
    },
    s3: {
      useAcceleration: toBool(getOsEnvOptional("S3_ACCELERATION_FLAG")),
    },
  };
};
