import "reflect-metadata";
import express, { json } from "express";
import { loadFreshEnv } from "config/env";
import { envLoader } from "loaders/env.loader";
import { createServer } from "http";
import path from "path";

async function startServer() {
  // Ensure environment is loaded before starting the server
  await loadFreshEnv();
  const app = express();
  const httpServer = createServer(app);

  app.use(json());
  app.use(express.static("public"));
  app.use(envLoader);

  app.get("/", (_req, res) => {
    res.json({
      msg: "Hello World",
    });
  });

  app.get("/healthcheck", (_req, res) => {
    res.json({
      msg: "Healthy 😀",
    });
  });
  const env = await import("config/env");
  if (!env.default.isProduction) {
    app.get("/documentation", (_req, res) => {
      res.sendFile(path.join(__dirname, "./documentation.html"));
    });
  }

  const { winstonLoader, expressLoader, swaggerLoader } = await import(
    "loaders"
  );

  winstonLoader();
  expressLoader(app);
  swaggerLoader(app);

  /**
   * To monitor server on local express route '/status' can be used
   */
  // monitorLoader(app);

  httpServer.listen(env.default.port, () => {
    console.log(`Server is running on port ${env.default.port} 🚀`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
