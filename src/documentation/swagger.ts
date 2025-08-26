import env from "config/env";
import documentSwagger from "./documents.swagger";
import downloadSwagger from "./downloads.swagger";
import multipartSwagger from "./multiparts.swagger";
import presignedSwagger from "./presigned.swagger";

const isDownloadFeatureEnabled = env.feature.download;
const isMultipartFeatureEnabled = env.feature.multipart;

export default {
  openapi: "3.0.3",
  info: {
    title: "Documents Microservice",
    description:
      "The Documents Microservice is designed to handle file operations related to the Pet Store. It provides capabilities for generating signed URLs for uploading and downloading files, retrieving information about files stored in Amazon S3, uploading files using multipart requests, and generating blur hashes for images. This service enhances the API's functionality by enabling secure and efficient file management.\n\n## Features:\n - **Generate Signed URLs**: Securely upload and download files from S3 with pre-signed URLs.\n - **File Information Retrieval**: Get detailed metadata about files stored in S3.\n - **Multipart File Uploads**: Support for uploading large files in chunks.\n - **Image Blur Hashing**: Generate blur hashes for images to provide a quick preview or placeholder.\n\n     \n## Some useful HTTP Headers\n - **Accept-Ranges**: Indicates if the server supports range requests for a resource, and the unit (e.g., bytes) it supports.\n - **Range**: Specifies the part of a resource that the client wants to retrieve. Typically used to request a specific byte range.\n - **Content-Range**: Used in responses to range requests, indicating the position of the part within the full resource.\n - **If-Range**: Allows the client to conditionally request a range, ensuring that the resource has not been modified since a specified version or date.\n - **Transfer-Encoding**: Indicates that the payload has been encoded using a transfer coding, such as chunked, to facilitate data transfer.\n\n## S3 Data Integrity Headers\n - **Content-MD5**: Base64-encoded MD5 hash of the object data, used by Amazon S3 to verify data integrity during transmission.\n - **x-amz-checksum-algorithm**: Specifies the algorithm used to create the checksum of the object (e.g., CRC32, CRC32C, SHA1, SHA256).\n - **x-amz-checksum-crc32**: The base64-encoded, 32-bit CRC32 checksum of the object. Used to verify the data integrity of the uploaded object.\n - **x-amz-checksum-crc32c**:  The base64-encoded, 32-bit CRC32C checksum of the object. Used for enhanced error-checking capabilities.\n - **x-amz-checksum-sha1**: The base64-encoded SHA-1 checksum of the object. Used to verify data integrity with the SHA-1 hashing algorithm.\n - **x-amz-checksum-sha256**: The base64-encoded SHA-256 checksum of the object. Provides a stronger level of data integrity verification using the SHA-256 hashing algorithm.\n - **x-amz-content-sha256**: The SHA-256 hash of the payload, used to verify the integrity of the uploaded data.\n ",
    contact: {
      name: "webelight solutions",
      url: "https://www.webelight.co.in/",
      email: "sales@webelight.co.in",
    },
    version: "1.0.0",
  },
  servers: [
    {
      url: `/${env.app.routePrefix}`,
    },
  ],
  tags: [
    documentSwagger.tag,
    presignedSwagger.tag,
    ...(isDownloadFeatureEnabled ? [downloadSwagger.tag] : []),
    ...(isMultipartFeatureEnabled ? [multipartSwagger.tag] : []),
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    ...documentSwagger.paths,
    ...presignedSwagger.paths,
    ...(isDownloadFeatureEnabled && downloadSwagger.paths),
    ...(isMultipartFeatureEnabled && multipartSwagger.paths),
  },
  components: {
    schemas: {
      ...documentSwagger.components.schemas,
      ...presignedSwagger.components.schemas,
      ...(isDownloadFeatureEnabled && downloadSwagger.components.schemas),
      ...(isMultipartFeatureEnabled && multipartSwagger.components.schemas),
      UnauthorizedRequestResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Unauthorized request!",
          },
        },
      },
      BadRequestResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "message that suggest what's wrong with request",
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
