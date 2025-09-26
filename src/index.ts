import express from "express";
import log from "./util.js";
import ImageRequest from "./ImageRequest";
import clearCache from "./clearCache";
const app = express();
const port = 3000;

app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

app.get("/clearCache", (req, res) => {
  const token = req.query.token;
  if (token !== process.env.CLEAR_CACHE_TOKEN) {
    return res.status(401).send("Unauthorized");
  } else {
    clearCache();
    res.send("Cache cleared");
  }
});

app.get("/:imageName(*)", async (req, res) => {
  const begin = new Date().getMilliseconds();
  const imageName = req.params.imageName;
  const request = new ImageRequest(imageName);

  await request.serveImage(res);

  const end = new Date().getMilliseconds();

  log(`Handled Request: ${imageName} in ${end - begin}ms`);
});

app.listen(port, () => {
  log(`P.I.C.S listening on port ${port}`);
});
