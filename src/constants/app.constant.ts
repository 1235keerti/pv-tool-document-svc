import env from "config/env";

export const hmacAlgorithm = "SHA256";

export const webhookCred =
  env.webhook.url && env.webhook.secretKey
    ? { url: env.webhook.url, secretKey: env.webhook.secretKey }
    : false;

export const blurHashSizeLimit = 10 * 1024 * 1024; // 10 MB
