import { configure, format, transports } from "winston";
import env from "config/env";

export const winstonLoader = (): void => {
  configure({
    transports: [
      new transports.Console({
        level: env.log.level,
        handleExceptions: true,
        format: env.isDevelopment
          ? format.combine(format.colorize(), format.simple())
          : format.combine(format.json()),
      }),
    ],
  });
};
