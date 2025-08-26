export interface EnvConfig {
  node: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isDockerDeployment: boolean;
  domain?: string;
  port: number;
  allowedOrigins: string[];
  app: {
    name: string;
    routePrefix: string;
  };
  feature: {
    download: boolean;
    multipart: boolean;
    webhook: boolean;
  };
  log: {
    level: string;
  };
  swagger: {
    route: string;
    username: string;
    password: string;
  };
  monitor: {
    route: string;
    username: string;
    password: string;
  };
  aws: {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucketName: string;
    zipProcessorFunction?: string;
  };
  preSign: {
    expire: number;
    minFileSize: number;
    maxFileSize: number;
  };
  document: {
    presignedUrlAllowedFileTypes: string[];
  };
  documents: {
    maxZipFiles: number;
    zipExpirationDays: number;
  };
  multipart: {
    expire: number;
  };
  auth: {
    secretKey: string;
    basicAuthUsername: string;
    basicAuthPassword: string;
    authCookieKeys: string[];
  };
  webhook: {
    secretKey?: string;
    url?: string;
  };
  cloudFront: {
    url: string;
    privateKey?: string;
    keyPairId?: string;
    signedExpire: number;
  };
  s3: {
    useAcceleration: boolean;
  };
}
