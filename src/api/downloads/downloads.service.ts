import { getSignedCookies, getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { Service } from "typedi";
import env from "config/env";
import { getDate } from "utils/date.utils";
import { InternalServerError } from "routing-controllers";
import { appErrorMessages } from "constants/message";
import {
  CloudFrontSignedUrlResponse,
  GetCloudFrontSignedParams,
  GetSignedCloudFrontCookie,
} from "./downloads.interface";

@Service()
export default class DownloadService {
  private readonly cloudFrontPrivateKey: string;

  private readonly cloudFrontKeyPairId!: string;

  private readonly cloudFrontUrl!: string;

  constructor() {
    if (
      !env.cloudFront.privateKey ||
      !env.cloudFront.keyPairId ||
      !env.cloudFront.signedExpire
    ) {
      throw new InternalServerError(appErrorMessages.cloudFrontConfig);
    }

    this.cloudFrontPrivateKey = env.cloudFront.privateKey;
    this.cloudFrontKeyPairId = env.cloudFront.keyPairId;
    this.cloudFrontUrl = env.cloudFront.url;
  }

  getCloudFrontSignedParams(key: string): GetCloudFrontSignedParams {
    const url = `${this.cloudFrontUrl}/${key}`;
    const expires = getDate({
      minutes: env.cloudFront.signedExpire,
    });

    const expiresIn = expires.getTime() / 1000;

    const policy = {
      Statement: [
        {
          Resource: url,
          Condition: {
            DateLessThan: { "AWS:EpochTime": expiresIn },
          },
        },
      ],
    };

    return {
      privateKey: this.cloudFrontPrivateKey,
      keyPairId: this.cloudFrontKeyPairId,
      policy: JSON.stringify(policy),
      expires,
    };
  }

  getSignedCloudFrontCookie(key: string): GetSignedCloudFrontCookie {
    const { expires, ...cloudFrontSignedParams } =
      this.getCloudFrontSignedParams(key);

    const cookies = getSignedCookies(cloudFrontSignedParams);

    return { cookies, expires };
  }

  getCloudFrontSignedUrl(key: string): CloudFrontSignedUrlResponse {
    const { expires: _expires, ...cloudFrontSignedParams } =
      this.getCloudFrontSignedParams(key);

    const url = getSignedUrl(cloudFrontSignedParams);

    return { url };
  }
}
