const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.get("/img/:imageName(*)", async (req, res) => {
  const imageName = req.params.imageName;

  const filePathCache = path.join(__dirname, "../.cache/", imageName.replaceAll('/', '-'));
  const filePathSource = path.join(__dirname, "../images/", imageName);
  
  const fileInSource = fs.existsSync(filePathSource);
  const fileInCache = fs.existsSync(filePathCache);
  
  const sizeRegex = /_(\d+)x(\d+)(?=.[a-z]*)/;
  const [string, imageWidth, imageHeight] = imageName.match(sizeRegex) || [
    null,
    null,
    null,
  ];

  if (!fileInCache && !fileInSource) {
    console.time("Converting " + imageName + ": ");

    const sourceImage = path.join(
      __dirname,
      "../images/",
      imageName.replace(/_(\d+)x(\d+)/, "")
    );

    await sharp(sourceImage)
      .resize(parseInt(imageWidth), parseInt(imageHeight))
      .toFile(filePathCache);

    console.timeEnd("Converting " + imageName + ": ");
  }

  res.sendFile(!string ? filePathSource : filePathCache);
});

app.listen(port, () => {
  console.log(`Image server listening on port ${port}`);
});
