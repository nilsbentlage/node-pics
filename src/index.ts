import fs from "fs";
import path from "path";
import express from "express";
import ImageRequest, { FillMode } from "./classes/ImageRequest";
import Cache from "./classes/Cache";
import { log, renderHtmlPage } from "./util";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const PORT = 3000;
const cacheDirectory = ".cache";

const cache = new Cache(cacheDirectory);

const app = express();

app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

app.get("/health", (_req, res) => {
  const healthData = cache.getHealth();
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: healthData.uptime,
    filesInCache: healthData.filesInCache,
    cacheSize: healthData.cacheSize,
  });
});

app.delete("/clear", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== process.env.CLEAR_CACHE_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid Bearer token required",
    });
  }

  cache.clear();
  res.json({
    message: "Cache cleared successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/:imageName(*)", async (req, res) => {
  const begin = Date.now();
  const imageName = req.params.imageName;

  if (!imageName) {
    try {
      const readmePath = path.join(__dirname, "..", "readme.md");
      const readmeContent = fs.readFileSync(readmePath, "utf8");
      const htmlPage = await renderHtmlPage(
        readmeContent,
        cache,
        process.env.EMBED_TOKEN === "true"
          ? process.env.CLEAR_CACHE_TOKEN
          : undefined
      );
      res.setHeader("Content-Type", "text/html");
      res.send(htmlPage);
    } catch (error: any) {
      log(`Error serving help page: ${error.message}`);
      res.status(500).json({
        error: "Could not load help documentation",
        message: error.message,
      });
    }
  }

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
    const request = new ImageRequest(cache, imageName, validatedFillMode);
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
