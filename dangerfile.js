const { schedule, fail, warn, danger } = require("danger");
const { makePrHygiene } = require("danger-typescript-plugin");
const { rules } = require("./.eslintrc.js");

makePrHygiene({ danger, warn, fail, schedule, rules });
