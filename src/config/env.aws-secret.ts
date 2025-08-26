import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from "dotenv";
import { NotFoundError } from "routing-controllers";
import { getOsEnvOptional } from "lib/env/util";
import { appErrorMessages } from "constants/message";

config();

const region = getOsEnvOptional("APP_AWS_REGION");
const client = new SecretsManagerClient({
  region, // Optional for serverless
});

export async function loadAwsSecrets(secretName: string): Promise<void> {
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });

  try {
    const response = await client.send(command);
    let secretString: string | undefined;

    if ("SecretString" in response && response.SecretString) {
      secretString = response.SecretString;
    } else if ("SecretBinary" in response && response.SecretBinary) {
      const buff = Buffer.from(response.SecretBinary as Uint8Array);
      secretString = buff.toString("utf-8");
    }

    if (!secretString) {
      throw new NotFoundError(appErrorMessages.awsSecretNotSet);
    }

    const parsedEnvJson = JSON.parse(secretString);

    // Set env variables from json to process.env
    Object.entries(parsedEnvJson).forEach(([key, value]) => {
      if (!value) return;

      const stringValue = String(value);
      process.env[key] =
        key === "CLOUDFRONT_PRIVATE_KEY"
          ? stringValue.replace(/\\n/g, "\n")
          : stringValue;
    });
  } catch (error) {
    console.error(`Error retrieving or parsing secret:`, error);
    throw error;
  }
}
