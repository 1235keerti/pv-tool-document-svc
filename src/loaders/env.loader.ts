import { loadFreshEnv } from "config/env";
import { NextFunction, Request, Response } from "express";

export const envLoader = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await loadFreshEnv();
    next();
  } catch (error) {
    next(error);
  }
};
