import express from "express";
import sharp from "sharp";
import { join } from "path";
import { existsSync, readdirSync } from "fs";
import log from "./util.js";

const app = express();
const port = 3000;

app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/:imageName(*)", async (req, res) => {
  const imageName = req.params.imageName;
  const fileExtension = imageName.split(".")[imageName.split(".").length - 1];

  const filePathSource = join("images/", imageName);
  const filePathCache = join(".cache/", imageName.replaceAll("/", "-"));

  const fileInSource = existsSync(filePathSource);
  const fileInCache = existsSync(filePathCache);

  const sizeRegex = /\d{1,4}x\d{1,4}/;
  const sizeString = imageName.match(sizeRegex);
  const [imageWidth, imageHeight] =
    (sizeString && sizeString[0].split("x")) || [];

  const begin = new Date();

  const isAvailable = !fileInCache && !fileInSource;

  if (isAvailable) {
    const basename = imageName
      .replace(/_(\d+)x(\d+)/, "")
      .replace(/\.(\w+)/, "");

    const sourceImagePath = join("images");
    const sourceImages = readdirSync(sourceImagePath);
    const sourceImage = sourceImages.find((image) => {
      return image.startsWith(basename);
    });

    if (!sourceImage) {
      res.send("Source Image: " + imageName + " was not found!");
      log("Source Image: " + imageName + " was not found!");
      return;
    }

    try {
      const sourceFileExtension = sourceImage.split(".")[1];
      const image = sharp(join(sourceImagePath, sourceImage));

      if (imageWidth && imageHeight) {
        image.resize(parseInt(imageWidth), parseInt(imageHeight));
      }
      if (fileExtension !== sourceFileExtension) {
        image.toFormat(fileExtension === "jpg" ? "jpeg" : fileExtension as any);
      }
      image.toFile(filePathCache).then(() => {
        res.sendFile(filePathCache, { root: "." });
      });
    } catch (err: any) {
      log("Could not create Image: " + err.message);
      res.send("Could not create Image: " + err.message);
    }
  } else {
    res.sendFile(fileInCache ? filePathCache : filePathSource, { root: "." });
  }

  log(
    `Handled Request: ${imageName} in ${new Date().getMilliseconds() - begin.getMilliseconds()}ms ${
      isAvailable ? "(incl. conversion to " + fileExtension + ")" : ""
    }`
  );
});

app.listen(port, () => {
  log(`P.I.C.S listening on port ${port}`);
});
