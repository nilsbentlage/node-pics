import log from "./util";
import { Response } from "express";
import fs from "fs";
import path, { join } from "path";
import sharp from "sharp";

const imageFolder = "images";
const cacheFolder = ".cache";

export type FillMode = "cover" | "contain" | "fill" | "inside" | "outside";

const picsRegex =
  /(?<basename>[A-z/\-][^_]*)(?:_)?(?<dimensions>\d{1,4}x\d{1,4})?(?:\.)(?<format>[a-z]{1,4})/;

export class ImageRequest {
  requestedFile!: string;
  basename!: string;
  filePath?: string;
  dimensions: string;
  format!: string;
  files!: { original: any; cache: any; source: any };
  fillMode: FillMode = "cover";

  constructor(requested: string, fillMode: FillMode) {
    if (fillMode) {
      this.fillMode = fillMode;
      fs.mkdirSync(path.join(cacheFolder, fillMode), { recursive: true });
      requested = path.join(fillMode, requested);
    }
    const regexArray = requested.match(picsRegex);
    if (regexArray) {
      [this.requestedFile, this.basename, this.dimensions, this.format] =
        regexArray || new Array(4).fill(null);
      if (this.basename.includes("/")) {
        this.basename = this.basename.split("/").pop() || this.basename;
        this.filePath = this.basename
          .split("/", this.basename.split("/").length - 1)
          .join("/");
      }
      this.files = {
        original: {
          path: path.join(imageFolder, this.requestedFile),
          exists: fs.existsSync(path.join(imageFolder, this.requestedFile)),
          format: this.format,
        },
        cache: {
          path: path.join(cacheFolder, this.requestedFile),
          exists: fs.existsSync(path.join(cacheFolder, this.requestedFile)),
          format: this.format,
        },
        source: {
          path:
            imageFolder +
            "/" +
            fs
              .readdirSync(path.join("images", this.filePath || ""))
              .find((foundFile) => foundFile.startsWith(this.basename)),
          exists: fs
            .readdirSync(path.join("images", this.filePath || ""))
            .find((foundFile) => foundFile.startsWith(this.basename))
            ? true
            : false,
          format: fs
            .readdirSync(path.join("images", this.filePath || ""))
            .find((foundFile) => foundFile.startsWith(this.basename))
            ?.split(".")[1],
        },
      };
    } else {
      throw new Error(
        "The requested requestedFile does not meet our Requirements"
      );
    }
  }

  convertImage(res?: Response) {
    const sourceFile = this.files.source.path;
    const sourceFileExtension = sourceFile.split(".")[1];
    const [width, height] = this.dimensions.split("x");

    return new Promise((resolve, reject) => {
      try {
        const image = sharp(join(sourceFile));

        if (width && height) {
          image.resize(parseInt(width), parseInt(height), {
            fit: this.fillMode,
          });
        }
        if (this.format !== sourceFileExtension) {
          image.toFormat(this.format === "jpg" ? "jpeg" : (this.format as any));
        }
        image
          .toFile(this.files.cache.path)
          .then(() => {
            res && res.sendFile(this.files.cache.path, { root: "." });
          })
          .then(() => {
            resolve("done");
          });
      } catch (err: any) {
        log("Could not create Image: " + err.message, res);
        reject("Could not create Image: " + err.message);
      }
    });
  }

  async serveImage(res?: Response) {
    if (this.files.original.exists) {
      res && res.sendFile(this.files.original.path, { root: "." });
    } else if (this.files.cache.exists) {
      res && res.sendFile(this.files.cache.path, { root: "." });
    } else {
      await this.convertImage(res).catch((err) => console.log(err));
    }
  }
}
