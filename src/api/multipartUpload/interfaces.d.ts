interface BaseResponse {
  status: number;
  message?: string;
}

interface MultipartUploadPart {
  ETag: string;
  PartNumber: number;
}

interface GeneratePresignedUrlsInput {
  uploadId: string;
  totalParts: number;
  key: string;
}

interface CompleteMultipartUploadInput {
  uploadId: string;
  parts: MultipartUploadPart[];
  key: string;
}

interface MultipartInitiateResponse extends BaseResponse {
  data?: {
    uploadId: string;
  };
}

interface GeneratePresignedUrlResponse {
  signedUrl: string;
  PartNumber: number;
}

interface MultipartPresignedUrlsResponse extends BaseResponse {
  data?: {
    presignedUrls: GeneratePresignedUrlResponse[];
  };
}

interface MultipartCompleteResponse extends BaseResponse {
  data?: {
    location: string;
  };
}

interface MultipartAbortResponse extends BaseResponse {
  data?: {
    message: string;
  };
}

interface MultipartListUploadedChunksResponse {
  data?: {
    uploadedChunks: number[];
  };
}

interface GeneratePresignedUrlBody {
  uploadId: string;
  totalParts: number;
}

interface CompleteMultipartBody {
  uploadId: string;
  parts: MultipartUploadPart[];
}

interface AboutMultipart {
  uploadId: string;
}

interface ListUploadParts {
  parts: {
    PartNumber?: number;
    ETag?: string;
  }[];
  maxParts?: number;
  partNumberMarker?: string;
}

interface InitiateMultipartUpload {
  key: string;
  contentType?: string;
  accessControl?: ObjectAcl;
  contentDisposition?: string;
  metadata?: Record<string, string>;
}

interface MultipartList {
  key: string;
  uploadId: string;
  partNumberMarker?: string;
  maxParts?: number;
}

interface AbortMultipart {
  uploadId: string;
  key: string;
}
