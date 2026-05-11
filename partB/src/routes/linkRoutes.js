import { Router } from "express";
import {
  LinkConflictError,
  LinkExpiredError,
  LinkNotFoundError,
  LinkService,
  LinkValidationError
} from "../services/linkService.js";

function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

export function createLinkRouter(service = new LinkService()) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const links = await service.listLinks(getBaseUrl(req));
      res.json({ links });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:shortCode", async (req, res, next) => {
    try {
      const link = await service.getLinkStats(req.params.shortCode, getBaseUrl(req));
      res.json({ link });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const link = await service.createLink(req.body, getBaseUrl(req));
      res.status(201).json({ link });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:shortCode", async (req, res, next) => {
    try {
      await service.deleteLink(req.params.shortCode);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createRedirectRouter(service = new LinkService()) {
  const router = Router();

  router.get("/:shortCode", async (req, res, next) => {
    try {
      const targetUrl = await service.getRedirectTarget(req.params.shortCode);
      res.redirect(302, targetUrl);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function linkErrorHandler(error, req, res, next) {
  if (error instanceof LinkValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof LinkConflictError) {
    return res.status(409).json({ error: error.message });
  }

  if (error instanceof LinkNotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof LinkExpiredError) {
    return res.status(410).json({ error: error.message });
  }

  return next(error);
}
