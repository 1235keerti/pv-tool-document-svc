interface RequestHeaders extends IncomingHttpHeaders {
  Cookie?: string;
  cookie?: string;
}

type StaticOrigin =
  | boolean
  | string
  | RegExp
  | Array<boolean | string | RegExp>;

type GenerateBlurHashHandlerResponse =
  | undefined
  | string
  | {
      key: string;
      blurHash: string;
    };

interface HandlerResponse {
  statusCode: StatusCodes;
  body: string;
  headers: Record<string, string | boolean>;
}

interface HandlerTimeOut<T> {
  fn: Promise<T>;
  event: APIGatewayEvent;
  timeout: number;
}
