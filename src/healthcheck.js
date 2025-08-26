import { request } from "http";
import env from "./config/env";

const options = {
  host: "localhost",
  port: env.port,
  timeout: 2000,
  path: "/healthcheck",
};

const healthCheck = request(options, (res) => {
  console.log(`HEALTH CHECK STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on("error", (err) => {
  console.error(`HEALTH CHECK ERROR: ${err}`);
  process.exit(1);
});

healthCheck.end();
