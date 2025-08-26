import { Application, NextFunction, Request, Response } from "express";
import basicAuth from "express-basic-auth";
// import monitor from "express-status-monitor";
import env from "config/env";

/**
 * To monitor server on local express route '/status' can be used
 */
export const monitorLoader = (app: Application): void => {
  const expressApp = app;

  // expressApp.use(monitor());
  expressApp.get(
    env.monitor.route,
    env.monitor.username
      ? basicAuth({
          users: {
            [`${env.monitor.username}`]: env.monitor.password,
          },
          challenge: true,
        })
      : (_req: Request, _res: Response, next: NextFunction) => next(),
    // monitor(),
  );
};
