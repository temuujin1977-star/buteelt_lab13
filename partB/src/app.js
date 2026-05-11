import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LinkService } from "./services/linkService.js";
import { createLinkRouter, createRedirectRouter, linkErrorHandler } from "./routes/linkRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp({ service = new LinkService() } = {}) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/links", createLinkRouter(service));
  app.use(createRedirectRouter(service));
  app.use(linkErrorHandler);

  return app;
}
