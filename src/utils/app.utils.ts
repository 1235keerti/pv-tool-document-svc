import { BadRequestError } from "routing-controllers";

export const getQueryObject = (
  field: string,
  data?: string,
): Record<string, string> | undefined => {
  try {
    if (!data) {
      return;
    }

    return JSON.parse(data.trim().slice(1, -1));
  } catch (err) {
    throw new BadRequestError(`invalid JSON object at "${field}"`);
  }
};
