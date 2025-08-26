type LogLevels = "error" | "info" | "debug" | "warn";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

declare module "*.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CommonResponseType<T = any> {
  status?: number;
  message?: string;
  error?: AnyType;
  data?: T;
}
