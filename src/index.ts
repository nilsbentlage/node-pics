import express from "express";
import log from "./util";
import ImageRequest from "./ImageRequest";
import clearCache from "./clearCache";
import fs from "fs";
import path from "path";

// Ensure required directories exist
const requiredDirs = ["images", ".cache"];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`);
  }
});

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

app.get("/health", (_req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post("/clearCache", (req, res) => {
  const token = req.body.token;
  if (token !== process.env.CLEAR_CACHE_TOKEN) {
    return res.status(401).send("Unauthorized");
  } else {
    clearCache();
    res.send("Cache cleared");
  }
});

app.get("/:imageName(*)", async (req, res) => {
  const begin = Date.now();
  const imageName = req.params.imageName;
  
  try {
    const request = new ImageRequest(imageName);
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

app.listen(port, () => {
  log(`P.I.C.S listening on port ${port}`);
});
