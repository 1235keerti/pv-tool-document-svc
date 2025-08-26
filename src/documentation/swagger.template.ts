import fs from "fs";
import path from "path";

const readFileSync = (filePath: AnyType) => fs.readFileSync(filePath, "utf8");

const swaggerUiDist = require("swagger-ui-dist").getAbsoluteFSPath();

const swaggerCss = readFileSync(path.join(swaggerUiDist, "swagger-ui.css"));
const swaggerBundleJs = readFileSync(
  path.join(swaggerUiDist, "swagger-ui-bundle.js"),
);
const swaggerStandalonePresetJs = readFileSync(
  path.join(swaggerUiDist, "swagger-ui-standalone-preset.js"),
);

export const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swagger UI</title>
        <style>
            ${swaggerCss}
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script>
            ${swaggerBundleJs}
        </script>
        <script>
            ${swaggerStandalonePresetJs}
        </script>
        <script>
            window.onload = () => {
                window.ui = SwaggerUIBundle({
                    url: "./swagger.json",
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "BaseLayout"
                });
            };
        </script>
    </body>
    </html>
    `;
