export default {
  tag: {
    name: "download",
    description: "get signed creads or download related links",
  },
  paths: {
    "/downloads/signed-url": {
      get: {
        tags: ["download"],
        summary: "generate signed url to access file",
        description: "generate signed url to access given key file",
        operationId: "cloudfrontSignedUrl",
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
            description: "Successfully generated signed url for given key",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      example: "url with predefined headers",
                    },
                  },
                },
              },
              "application/xml": {
                schema: {
                  type: "string",
                  example: "url with predefined headers",
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
    "/downloads/signed-cookies": {
      get: {
        tags: ["download"],
        summary: "generate signed cookies access file",
        description: "generate signed cookies to access given key file",
        operationId: "cloudfrontSignedCookie",
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
            description: "Successfully generated signed cookies for given key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignedCloudFrontCookieResponse",
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/SignedCloudFrontCookieResponse",
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
      GetSignedCloudFrontCookie: {
        type: "object",
        properties: {
          "CloudFront-Key-Pair-Id": {
            type: "string",
            description: "cloud front key pair Id",
            example: "JDSHFIUSYF",
          },
          "CloudFront-Signature": {
            type: "string",
            description: "cloud front signature to varify request",
            example: "sfkjsdf8ef98yhdkfkjd...",
          },
          "CloudFront-Expires": {
            type: "string",
            description: "cloud front cookie expirations time",
            example: 32468385,
          },
          "CloudFront-Policy": {
            type: "string",
            description: "cloud front policy to add conditions",
            example: "shfysd98fyhdjfhjkdfjgjrejfhj...",
          },
        },
      },
      SignedCloudFrontCookieResponse: {
        type: "object",
        properties: {
          cookies: {
            $ref: "#/components/schemas/GetSignedCloudFrontCookie",
          },
        },
      },
    },
  },
};
