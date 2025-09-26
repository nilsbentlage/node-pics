import express from "express";
import log from "./util";
import ImageRequest, { FillMode } from "./ImageRequest";
import clearCache from "./clearCache";
import fs from "fs";

const PORT = 3000;

const requiredDirs = ["images", ".cache"];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`);
  }
});

const app = express();

app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.delete("/clearCache", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== process.env.CLEAR_CACHE_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid Bearer token required",
    });
  }

  clearCache();
  res.json({
    message: "Cache cleared successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/:imageName(*)", async (req, res) => {
  const begin = Date.now();
  const imageName = req.params.imageName;

  // Validate fillMode parameter
  const validFillModes: FillMode[] = [
    "cover",
    "contain",
    "fill",
    "inside",
    "outside",
  ];
  const fillMode = req.query.mode as FillMode;
  const validatedFillMode =
    fillMode && validFillModes.includes(fillMode) ? fillMode : undefined;

  try {
    const request = new ImageRequest(imageName, validatedFillMode);
    await request.serveImage(res);

    const end = Date.now();
    log(`Handled Request: ${imageName} in ${end - begin}ms`);
  } catch (error: any) {
    log(`Error handling request ${imageName}: ${error.message}`);
    if (!res.headersSent) {
      res.status(400).send(`Error: ${error.message}`);
    }
  }
});

app.listen(PORT, () => {
  log(`P.I.C.S listening on port ${PORT}`);
});
