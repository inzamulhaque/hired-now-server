import http from "http";
import config from "./config/index.js";
import app from "./app.js";
import { initSocketServer } from "./socket/index.js";

const port = config.port || 5000;

async function main() {
  const server = http.createServer(app);

  initSocketServer(server);

  server.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

main();
