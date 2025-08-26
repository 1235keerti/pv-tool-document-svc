import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import { hmacAlgorithm } from "constants/app.constant";

const generateSignature = <T>(body: T, secretKey: string) => {
  const timestamp = new Date().getTime();

  const hmac = crypto.createHmac(hmacAlgorithm, secretKey);

  const signature = hmac
    .update(timestamp.toString() + JSON.stringify(body))
    .digest("base64");

  return { signature, timestamp };
};

const prepareHeaders = <T>(body: T, secretKey: string) => {
  const { signature, timestamp } = generateSignature(body, secretKey);

  return {
    "x-signature-timestamp": timestamp,
    "x-signature-signature": signature,
  };
};

export const sendWebhook = <T>(
  data: T,
  { url, secretKey }: { url: string; secretKey: string },
): Promise<AxiosResponse> => {
  return axios.post(url, data, { headers: prepareHeaders(data, secretKey) });
};
