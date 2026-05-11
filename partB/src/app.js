import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { linkRouter } from "./routes/linkRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/links", linkRouter);

  return app;
}
