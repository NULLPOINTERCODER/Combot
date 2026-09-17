import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`[server] listening on ${env.SERVER_URL} (${env.NODE_ENV})`);
    });
  } catch (err) {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  }
}

start();
