import express, { NextFunction, Request, Response } from "express";
import basicAuth from "express-basic-auth";
import env from "config/env";
import { Logger } from "lib/logger";
import swaggerDocument from "../documentation/swagger";
import { htmlContent } from "../documentation/swagger.template";

const logger = new Logger("SwaggerLoader");

export const swaggerLoader = (app: express.Application): void => {
  logger.info(
    `swagger info:-- { url:${JSON.stringify(swaggerDocument.servers)} cred: ${JSON.stringify(env.swagger)} }`,
  );

  app.get("/swagger.json", (_req, res) => {
    res.json(swaggerDocument);
  });

  app.use(
    `/${env.swagger.route}`,
    env.swagger.username
      ? basicAuth({
          users: {
            [`${env.swagger.username}`]: env.swagger.password,
          },
          challenge: true,
        })
      : (_req: Request, _res: Response, next: NextFunction) => next(),
    (_req, resp) => {
      resp.send(htmlContent);
    },
  );
};
