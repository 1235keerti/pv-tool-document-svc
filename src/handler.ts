import express, { json } from "express";
import "reflect-metadata";
import serverlessHttp from "serverless-http";
import { APIGatewayEvent, Context } from "aws-lambda";
import { loadFreshEnv } from "config/env";
import path from "path";

let serverHandler: serverlessHttp.Handler | null = null;
async function initializeApp() {
  if (serverHandler) {
    return serverHandler;
  }

  // Ensure environment is loaded before initializing the app
  await loadFreshEnv();

  const app = express();
  app.use(json());
  app.use(express.static("public"));

  const { winstonLoader, expressLoader, swaggerLoader } = await import(
    "loaders"
  );

  winstonLoader();
  expressLoader(app);
  swaggerLoader(app);

  const env = await import("config/env");
  if (!env.default.isProduction) {
    app.get("/documentation", (_req, res) => {
      res.sendFile(path.join(__dirname, "./public/documentation.html"));
    });
  }

  serverHandler = serverlessHttp(app);

  return serverHandler;
}

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<object> => {
  const server = await initializeApp();

  const { withTimeout } = await import("utils/timeout.utils");

  return withTimeout({
    fn: server(event, context),
    event,
    timeout: 30000,
  });
};
