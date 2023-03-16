const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/pics/:imageName(*)", async (req, res) => {
  const imageName = req.params.imageName;
  const fileExtension = imageName.split(".")[imageName.split(".").length - 1];

  const filePathCache = path.join(
    __dirname,
    "../.cache/",
    imageName.replaceAll("/", "-")
  );
  const filePathSource = path.join(__dirname, "../images/", imageName);

  const fileInSource = fs.existsSync(filePathSource);
  const fileInCache = fs.existsSync(filePathCache);

  const imageRegex = /_(\d+)x(\d+)\.(\w+)/;
  const [, imageWidth, imageHeight] = imageName.match(imageRegex) || [
    null,
    null,
    null,
  ];

  if (!fileInCache && !fileInSource) {
    console.time("Converting " + imageName + ": ");
    const basename = imageName
      .replace(/_(\d+)x(\d+)/, "")
      .replace(/\.(\w+)/, "");

    const sourceImages = fs.readdirSync(path.join(__dirname, "../images"));
    const sourceImage = sourceImages.find((image) => {
      return image.includes(basename);
    });

    if (!sourceImage) {
      res.send(imageName + " was not found!");
      console.log(imageName + " was not found!");
      return;
    }

    const sourceFileExtension = sourceImage.split(".")[1];
    const sourceImagePath = path.join(__dirname, "../images");

    try {
      const image = sharp(path.join(sourceImagePath, sourceImage));

      if (imageWidth && imageHeight) {
        image.resize(parseInt(imageWidth), parseInt(imageHeight));
      }
      if (fileExtension !== sourceFileExtension) {
        image.toFormat("." + fileExtension === "jpg" ? "jpeg" : fileExtension);
      }
      image.toFile(filePathCache).then(() => {
        res.sendFile(filePathCache);
      });
      console.timeEnd("Converting " + imageName + ": ");
    } catch (err) {
      console.log("Could not create Image");
      res("Could not create Image");
    }
  } else {
    res.sendFile(fileInCache ? filePathCache : filePathSource);
  }
});

app.listen(port, () => {
  console.log(`Image server listening on port ${port}`);
});
