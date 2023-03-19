import fs from "fs";
import path from "path";

const imageFolder = "images";
const cacheFolder = ".cache";

export class ImageRequest {
  filename!: string;
  basename!: string;
  width?: string;
  height?: string;
  format!: string;

  constructor(requested: string) {
    const picsRegex = /([^_]*)(?:(?:_)(?:(\d{1,4})x(\d{1,4})))?\.([a-z]{1,4})/;
    const regexArray = requested.match(picsRegex);
    if (regexArray) {
      [this.filename, this.basename, this.width, this.height, this.format] =
        regexArray || new Array(5).fill(null);
    } else {
      throw new Error("The requested filename does not meet our Requirements");
    }
  }

  fileInCache() {
    if (fs.existsSync(path.join(cacheFolder, this.filename))) {
      return path.join(cacheFolder, this.filename);
    } else {
      return false;
    }
  }

  fileInSource() {
    if (fs.existsSync(path.join(imageFolder, this.filename))) {
      return path.join(imageFolder, this.filename);
    } else {
      return false;
    }
  }
}

console.log("Tests asdasd");
new ImageRequest("test_300x300.jpg");
new ImageRequest("test23123.jpg");
new ImageRequest("models/test23123.jpg");
new ImageRequest("models/test_231x231.jpg");
