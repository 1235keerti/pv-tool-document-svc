export default {
  tag: {
    name: "document",
    description: "Get details about your documents",
  },
  paths: {
    "/documents/blur-hash": {
      get: {
        tags: ["document"],
        summary: "generate blur-hash for existing image",
        description:
          "generate blur-hash using existing image key(path), and get blurHash in response",
        operationId: "updatePet",
        parameters: [
          {
            name: "key",
            in: "query",
            description: "The Key of existing object",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Blur Hash generated Successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenerateBlurHashResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/GenerateBlurHashResponse",
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
    "/documents/info": {
      get: {
        tags: ["document"],
        summary: "generate blur-hash for existing image",
        description: "Update an existing pet by Id",
        operationId: "getObjectInfo",
        parameters: [
          {
            name: "key",
            in: "query",
            description: "The Key of existing object",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrived file Information",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetObjectInfo",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/GetObjectInfo",
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
          "404": {
            description: "it will occured if provided key not exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Resource Not Found.",
                    },
                  },
                },
              },
              "application/xml": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Resource Not Found.",
                    },
                  },
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
      GenerateBlurHashResponse: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The Key that used to store file",
            example: "public/myfile",
          },
          blurHash: {
            type: "string",
            description: "generated blurHash",
            example: "BIUR*RjRjRjxuRjs.MxbbV@WY",
          },
        },
      },
      GetObjectInfo: {
        type: "object",
        properties: {
          LastModified: {
            type: "string",
            description: "Date when object last modified",
            example: "1970-01-01T00:00:00.000Z",
          },
          ContentLength: {
            type: "number",
            description: "content size in bytes",
            example: 1024,
          },
          ContentType: {
            type: "string",
            description: "content type",
            example: "image/jpeg",
          },
          MetaData: {
            type: "string",
            description: "content metaData like blurHash",
            example: {
              blurHash: "BIUR*RjRjRjxuRjs.MxbbV@WY",
            },
          },
        },
      },
    },
  },
};
