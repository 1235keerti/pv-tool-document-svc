export default {
  tag: {
    name: "presigned",
    description: "get presigned urls to uplaod objects",
  },
  paths: {
    "/presigned": {
      get: {
        tags: ["presigned"],
        summary: "generate signed url",
        description: "generate signed url to upload file",
        operationId: "getSignedUrl",
        parameters: [
          {
            name: "fileName",
            in: "query",
            description: "The Key that used to store file",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "fileType",
            in: "query",
            description: "content type",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "accessControl",
            in: "query",
            description: "access control, private or public-read",
            required: false,
            schema: {
              type: "string",
              default: "public-read",
            },
          },
          {
            name: "metadata",
            in: "query",
            description:
              "metadata which stored with file, (should be stringified object)",
            required: false,
            schema: {
              type: "string",
              example: '{"blurHash":"jdhkjygidfygidhfk", ...}',
            },
          },
        ],
        responses: {
          "200": {
            description: "Successfully generated presigned url to upload file",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetPresignUrlResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/GetPresignUrlResponse",
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
    "/presigned/post": {
      get: {
        tags: ["presigned"],
        summary: "generate signed post url",
        description:
          "generate signed post url to upload file with predefined conditions",
        operationId: "getSignedPostUrl",
        parameters: [
          {
            name: "fileName",
            in: "query",
            description: "The Key that used to store file",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "fileType",
            in: "query",
            description: "content type",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "accessControl",
            in: "query",
            description: "access control, private or public-read",
            required: false,
            schema: {
              type: "string",
              default: "public-read",
            },
          },
          {
            name: "metadata",
            in: "query",
            description:
              "metadata which stored with file, (should be stringified object)",
            required: false,
            schema: {
              type: "string",
              example: '{"blurHash":"jdhkjygidfygidhfk", ...}',
            },
          },
        ],
        responses: {
          "200": {
            description:
              "Successfully generated presigned post url to upload file",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetPresignPostUrlResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/GetPresignPostUrlResponse",
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
      GetPresignUrl: {
        type: "object",
        properties: {
          fileName: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
          fileType: {
            type: "string",
            description: "content type",
            example: "image/jpg",
          },
          accessControl: {
            type: "string",
            description: "access control, private or public-read",
            example: "public-read",
            default: "public-read",
            enum: ["private", "public-read"],
          },
        },
        required: ["fileName", "fileType"],
      },

      GetPresignUrlResponse: {
        type: "object",
        properties: {
          signedRequest: {
            type: "string",
            description: "signed url with predefined header For PUT operation",
          },
          cloudFrontURL: {
            type: "string",
            description:
              "url which will use to access file after successfully upload",
          },
        },
      },
      GetPresignPostUrlResponse: {
        type: "object",
        properties: {
          signedRequest: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description:
                  "signed url with predefined header For PUT operation",
              },
              fields: {
                type: "string",
                description: "fields that used to upload file with conditions",
              },
            },
          },
          cloudFrontURL: {
            type: "string",
            description:
              "url which will use to access file after successfully upload",
          },
        },
      },
    },
  },
};
