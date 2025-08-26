import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { ObjectAcl } from "constants/enum";

export interface GetPresignUrl {
  fileName: string;
  fileType: string;
  accessControl?: ObjectAcl;
}

export interface GetPresignUrlQuery extends GetPresignUrl {
  metadata?: string;
}

export interface GetPresignUrlInput extends GetPresignUrl {
  metadata?: Record<string, string>;
}

export interface GetPresignUrlResponse {
  signedRequest: string;
  cloudFrontURL: string;
}

export interface GetPresignPostResponse
  extends Omit<GetPresignUrlResponse, "signedRequest"> {
  signedRequest: string | PresignedPost;
}
