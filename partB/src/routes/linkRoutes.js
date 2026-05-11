import { Router } from "express";

export const linkRouter = Router();

linkRouter.get("/", (req, res) => {
  res.json({
    message: "Link list endpoint will be implemented in checkpoint 2"
  });
});

linkRouter.post("/", (req, res) => {
  res.status(501).json({
    error: "Create short URL endpoint will be implemented in checkpoint 2"
  });
});
