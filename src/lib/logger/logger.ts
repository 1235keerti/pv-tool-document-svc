import * as winston from "winston";
import env from "config/env";
import path from "path";

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

const allowedLevels = env.isDevelopment
  ? ["error", "info", "debug", "warn"]
  : ["error", "warn"];

export class Logger {
  public static readonly DEFAULT_SCOPE = "app";

  private static parsePathToScope(filepath: string): string {
    let filePath = filepath;

    if (filePath.includes(path.sep)) {
      filePath = filePath
        .replace(new RegExp(`^${process.cwd()}[\\/\\\\]`), "")
        .replace(/[\\/\\\\]src[\\/\\\\]|[\\/\\\\]dist[\\/\\\\]/g, "")
        .replace(/\.(ts|js)$/g, "")
        .replace(/[\\/\\\\]/g, ":");
    }

    return filePath;
  }

  private readonly scope: string;

  constructor(scope?: string) {
    this.scope = Logger.parsePathToScope(scope ?? Logger.DEFAULT_SCOPE);
  }

  public debug(message: string): void {
    this.log("debug", message);
  }

  public info(message: string): void {
    this.log("info", message);
  }

  public warn(message: string): void {
    this.log("warn", message);
  }

  public error(message: string): void {
    this.log("error", message);
  }

  private log(level: LogLevels, message: string): void {
    if (allowedLevels.includes(level)) {
      winston[level](`${this.formatScope()} ${message}`);
    }
  }

  private formatScope(): string {
    return `[${this.scope}]`;
  }
}
