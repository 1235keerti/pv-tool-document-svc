import { useExpressServer } from "routing-controllers";
import env from "config/env";
import { MultipartUploadController } from "api/multipartUpload/multipartUpload.controller";
import { DocumentsController } from "api/documents/documents.controller";
import { DownloadController } from "api/downloads/downloads.controller";
import { PresignedController } from "api/presigned/presigned.controller";

export const expressLoader = (app: Express.Application): void => {
  useExpressServer(app, {
    classTransformer: true,
    routePrefix: env.app.routePrefix,
    defaultErrorHandler: false,
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: [
      ...(env.feature.multipart ? [MultipartUploadController] : []),
      ...(env.feature.download ? [DownloadController] : []),
      PresignedController,
      DocumentsController,
    ],
    cors: {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, origin?: StaticOrigin) => void,
      ) => {
        if (env.allowedOrigins.includes(origin ?? "")) {
          callback(null, true); // Allow the request
        } else {
          callback(null, false); // Block the request
        }
      },
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
    },
  });
};
