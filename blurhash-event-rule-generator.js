// blurhash-event-rule-generator.js

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// Fetch arrays from environment variables
// These environment variables are expected to be comma-separated strings of file paths and file extensions.
const filePaths = process.env.BLURHASH_FILE_PATHS
  ? JSON.parse(process.env.BLURHASH_FILE_PATHS)
  : []; // Default to an empty array if not set
const fileTypes = process.env.BLURHASH_FILE_EXTENSIONS
  ? JSON.parse(process.env.BLURHASH_FILE_EXTENSIONS)
  : []; // Default to an empty array if not set

// Initialize rules with default wildcard matching
// [] indicates a catch-all rule if no specific file paths or types are provided.
let rules = [];

// Update rules if file paths or file types are provided
if (filePaths.length || fileTypes.length) {
  // Create rules for each file path and type:
  // - 'prefix' matches files starting with the specified path.
  // - 'suffix' matches files with the specified extension.
  rules = [
    ...filePaths.map((path) => ({ prefix: path.trim() })), // Generate 'prefix' rules
    ...fileTypes.map((type) => ({ suffix: type.trim() })), // Generate 'suffix' rules
  ];
}

// Write rules to a YAML file
// 'js-yaml' library is used to convert the rules object to YAML format.
const yaml = require("js-yaml");
fs.writeFileSync("blurhash-event-rules.yml", yaml.dump({ rules })); // Write the YAML to a file
console.log("blurhash-event-rules.yml generated successfully!");
