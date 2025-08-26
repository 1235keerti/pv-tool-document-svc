export interface GenerateBlurHashResponse {
  key: string;
  blurHash: string;
}

export interface GetObjectInfo {
  LastModified?: Date;
  ContentLength?: number;
  ContentType?: string;
  Metadata?: Record<string, string>;
}

export interface ZipDocumentsRequest {
  files: string[];  // List of file keys to be zipped
  zipPath?: string; // Optional custom path for the zip file
}

export interface ZipDocumentsResponse {
  zipPath: string;  // Path to the generated zip file
  status?: 'pending' | 'completed';  // Status of the zip file generation
}

export interface CheckZipStatusRequest {
  zipPath: string;  // Path of the zip file to check
}
