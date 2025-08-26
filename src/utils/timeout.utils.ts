import { returnTimeOutError, setHandlerCors } from "constants/handler.response";

export function withTimeout<T>({
  fn,
  event,
  timeout,
}: HandlerTimeOut<T>): Promise<T> {
  const { headers } = event;
  const origin = headers.origin ?? headers.Origin;

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(returnTimeOutError(origin));
    }, timeout);

    fn.then(
      (result) => {
        setHandlerCors(result, origin);
        clearTimeout(timer);
        resolve(result);

        return result;
      },
      (error) => {
        console.log("Timeout error", error);
        clearTimeout(timer);
        reject(error);
      },
    ).catch((error) => {
      console.log("Timeout catch error", error);
      clearTimeout(timer);
      reject(error);
    });
  });
}
