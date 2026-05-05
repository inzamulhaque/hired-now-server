import type { Server } from "http";
import config from "./config/index.js";
import app from "./app.js";

const port = config.port || 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

main();
