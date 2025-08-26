import { CloudfrontSignedCookiesOutput } from "@aws-sdk/cloudfront-signer";

export interface GetCloudFrontSignedParams {
  privateKey: string;
  keyPairId: string;
  policy: string;
  expires: Date;
}

export interface GetSignedCloudFrontCookie {
  cookies: CloudfrontSignedCookiesOutput;
  expires: Date;
}

export interface CloudFrontSignedUrlResponse {
  url: string;
}
