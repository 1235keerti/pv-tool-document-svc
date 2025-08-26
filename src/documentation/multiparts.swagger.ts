/* eslint-disable max-lines */
export default {
  tag: {
    name: "multipart",
    description: "get information and signed urls to uplaod multipart",
  },
  paths: {
    "/multipart/initiate": {
      post: {
        tags: ["multipart"],
        summary: "Initiate multipart",
        description:
          "Initiate multipart with your configurations, like accessControl, contentDisposition, metaData.",
        operationId: "initiateMultipart",
        requestBody: {
          description: "Initiate multipart",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InitiateMultipartUpload",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/InitiateMultipartUpload",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/InitiateMultipartUpload",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully Initiated multipart upload",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InitiateMultipartResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/InitiateMultipartResponse",
                },
              },
            },
          },
          "400": {
            description: "it will occured if Request not satified with server",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
            },
          },
          "401": {
            description:
              "it will occured if cookie or bearer token not provided or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
            },
          },
        },
      },
    },
    "/multipart/presigned-urls": {
      post: {
        tags: ["multipart"],
        summary: "create signed urls",
        description: "create signed urls to upload each parts of file",
        operationId: "multipartSignedUrls",
        requestBody: {
          description: "create multipart signed urls",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GeneratePresignedUrlsInput",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/GeneratePresignedUrlsInput",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/GeneratePresignedUrlsInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully generated signed url to upload parts",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultipartSignedUrlResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/MultipartSignedUrlResponse",
                },
              },
            },
          },
          "400": {
            description: "it will occured if Request not satified with server",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
            },
          },
          "401": {
            description:
              "it will occured if cookie or bearer token not provided or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
            },
          },
        },
      },
    },
    "/multipart/complete": {
      post: {
        tags: ["multipart"],
        summary: "complete multipart upload",
        description:
          "complete multipart upload, if you uploaded all parts successfully.",
        operationId: "multipartComplete",
        requestBody: {
          description: "complete multipart upload",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompleteMultipartUploadInput",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/CompleteMultipartUploadInput",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/CompleteMultipartUploadInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully Completed multipart upload",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultipartCompleteResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/MultipartCompleteResponse",
                },
              },
            },
          },
          "400": {
            description: "it will occured if Request not satified with server",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
            },
          },
          "401": {
            description:
              "it will occured if cookie or bearer token not provided or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
            },
          },
        },
      },
    },
    "/multipart/abort": {
      post: {
        tags: ["multipart"],
        summary: "abort multipart upload",
        description:
          "Abourt Multipart upload, if some issue occured or you don't went to upload file",
        operationId: "multipartAbort",
        requestBody: {
          description: "abort multipart upload",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AbortMultipart",
              },
            },
            "application/xml": {
              schema: {
                $ref: "#/components/schemas/AbortMultipart",
              },
            },
            "application/x-www-form-urlencoded": {
              schema: {
                $ref: "#/components/schemas/AbortMultipart",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully Aborted multipart upload",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultipartAbortResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/MultipartAbortResponse",
                },
              },
            },
          },
          "400": {
            description: "it will occured if Request not satified with server",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
            },
          },
          "401": {
            description:
              "it will occured if cookie or bearer token not provided or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
            },
          },
        },
      },
    },
    "/multipart/uploaded-chunks": {
      get: {
        tags: ["multipart"],
        summary: "list out uploaded multiparts",
        description: "list out uploaded multiparts",
        operationId: "multipartList",
        parameters: [
          {
            name: "uploadId",
            in: "query",
            description: "uploadId that you generated",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "key",
            in: "query",
            description: "The Key that used to store file",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "partNumberMarker",
            in: "query",
            description: "PartNumber Marker to get next parts",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "maxParts",
            in: "query",
            description: "Maximum part you need in single request",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successfully Retrivied all uploaded file parts Info",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MultipartListResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/MultipartListResponse",
                },
              },
            },
          },
          "400": {
            description: "it will occured if Request not satified with server",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/BadRequestResponse",
                },
              },
            },
          },
          "401": {
            description:
              "it will occured if cookie or bearer token not provided or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/UnauthorizedRequestResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      InitiateMultipartUpload: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
          contentType: {
            type: "string",
            description: "content type",
            example: "image/jpg",
          },
          accessControl: {
            type: "string",
            description: "access control of file (private or public-read)",
            default: "public-read",
            example: "public-read",
            enum: ["private", "public-read"],
          },
          contentDisposition: {
            type: "string",
            example: "attachment",
          },
          metaData: {
            type: "object",
            description: "metadat to store info with object",
            example: {
              username: "name of user",
            },
          },
        },
        required: ["key", "fileType"],
      },
      GeneratePresignedUrlsInput: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "uploadId that you generated",
            example: "uploaId",
          },
          totalParts: {
            type: "number",
            description:
              "total files parts that will splitted for upload, minimum size is 5MB expect last part.",
            example: 10,
          },
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
        },
        required: ["uploadId", "totalParts", "key"],
      },
      MultipartUploadPart: {
        type: "object",
        properties: {
          ETag: {
            type: "string",
            description: "Etag that returned by s3 in header",
            example: "Etag",
          },
          PartNumber: {
            type: "string",
            description: "part number assosiated by Etag",
            example: 1,
          },
        },
        required: ["ETag", "PartNumber"],
      },
      CompleteMultipartUploadInput: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "uploadId that you generated",
            example: "uploadId",
          },
          parts: {
            description: "all parts Etags with part-numbers",
            $ref: "#/components/schemas/MultipartUploadPart",
          },
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
        },
        required: ["uploadId", "key", "parts"],
      },
      AbortMultipart: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "uploadId that you generated",
            example: "uploaId",
          },
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
        },
        required: ["uploadId", "key"],
      },
      MultipartList: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "uploadId that you generated",
            example: "uploaId",
          },
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
          partNumberMarker: {
            type: "number",
            description: "PartNumber Marker to get next parts",
            example: 10,
          },
          maxParts: {
            type: "number",
            description: "Maximum part you need in single request",
            example: 100,
          },
        },
        required: ["uploadId", "key"],
      },
      InitiateMultipartResponse: {
        type: "object",
        properties: {
          uploadId: {
            type: "string",
            description: "uploadId to identify upload",
            example: "sdfhiufyu8dsiufysdhfisdhf...",
          },
        },
      },
      MultipartSignedUrl: {
        type: "object",
        properties: {
          signedUrl: {
            type: "string",
            description: "signed url to upload file parts",
            example: "url with predefined headers",
          },
          PartNumber: {
            type: "number",
            description: "part number which will upload",
            example: 1,
          },
        },
      },
      MultipartSignedUrlResponse: {
        type: "object",
        properties: {
          presignedUrls: {
            type: "array",
            items: {
              $ref: "#/components/schemas/MultipartSignedUrl",
            },
          },
        },
      },
      MultipartCompleteResponse: {
        type: "object",
        properties: {
          cloudFrontURL: {
            type: "string",
            description: "cloudFrontURL where can access object",
            example: "object url",
          },
        },
      },
      MultipartAbortResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Multipart upload aborted successfully.",
          },
        },
      },
      MultipartListResponse: {
        type: "object",
        properties: {
          parts: {
            type: "array",
            items: {
              $ref: "#/components/schemas/MultipartUploadPart",
            },
            description: "multipart upload parts which uploaded successfully",
          },
          maxParts: {
            type: "number",
            description: "maximum parts returned in list",
            example: 10,
          },
          partNumberMarker: {
            type: "string",
            description: "list starting part marker",
            example: "5",
          },
        },
      },
    },
  },
};
