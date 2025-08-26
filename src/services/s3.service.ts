import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import env from "config/env";
import http from "http";
import https from "https";

class S3Service {
  private static instance: S3Client | null;

  public static getInstance(): S3Client {
    if (!S3Service.instance) {
      const agentOptions = {
        keepAlive: false,
        maxSockets: 1000,
      };

      const httpAgent = new http.Agent(agentOptions);
      const httpsAgent = new https.Agent(agentOptions);

      const s3ClientCred = {
        credentials: {
          secretAccessKey: env.aws.secretAccessKey,
          accessKeyId: env.aws.accessKeyId,
        },
        region: env.aws.region,
      } as S3ClientConfig;

      const config: S3ClientConfig = {
        ...(env.isDockerDeployment ? s3ClientCred : {}),
        requestHandler: new NodeHttpHandler({
          httpAgent,
          httpsAgent,
          connectionTimeout: 1000,
          requestTimeout: 5000,
        }),
        useAccelerateEndpoint: env.s3.useAcceleration,
      };

      S3Service.instance = new S3Client(config);
    }

    return S3Service.instance;
  }
}

export default S3Service;
