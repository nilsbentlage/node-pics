import log from "./util";
import { Response } from "express";
import fs from "fs";
import path, { join } from "path";
import sharp from "sharp";

const imageFolder = "images";
const cacheFolder = ".cache";

const picsRegex =
  /^(?<basename>[A-Za-z0-9/\-_][^_]*)(?:_(?<dimensions>\d{1,4}x\d{1,4}))?(?:\.)(?<format>[a-z]{3,4})$/;

class ImageRequest {
  requestedFile!: string;
  basename!: string;
  filePath?: string;
  dimensions?: string;
  format!: string;
  files!: { original: any; cache: any; source: any };

  constructor(requested: string) {
    const regexArray = requested.match(picsRegex);
    if (regexArray) {
      [this.requestedFile, this.basename, this.dimensions, this.format] =
        regexArray || new Array(4).fill(null);
      if (this.basename.includes("/")) {
        const pathParts = this.basename.split("/");
        this.filePath = pathParts.slice(0, -1).join("/");
        this.basename = pathParts[pathParts.length - 1];
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
        source: this.findSourceFile(),
      };
    } else {
      throw new Error(
        "The requested requestedFile does not meet our Requirements"
      );
    }
  }

  private findSourceFile() {
    try {
      const searchDir = path.join("images", this.filePath || "");
      
      if (!fs.existsSync(searchDir)) {
        return {
          path: null,
          exists: false,
          format: null,
        };
      }

      const files = fs.readdirSync(searchDir);
      const foundFile = files.find((file) => file.startsWith(this.basename));
      
      if (foundFile) {
        return {
          path: path.join(imageFolder, this.filePath || "", foundFile),
          exists: true,
          format: foundFile.split(".")[1],
        };
      }
      
      return {
        path: null,
        exists: false,
        format: null,
      };
    } catch (error) {
      return {
        path: null,
        exists: false,
        format: null,
      };
    }
  }

  processImage(res?: Response) {
    const sourceFile = this.files.source.path;
    
    if (!sourceFile || !this.files.source.exists) {
      const error = "Source file not found";
      log(error, res);
      return Promise.reject(error);
    }
    
    const sourceFileExtension = sourceFile.split(".")[1];

    return new Promise((resolve, reject) => {
      try {
        const image = sharp(join(sourceFile));

        // Apply resizing if dimensions are specified
        if (this.dimensions) {
          const [width, height] = this.dimensions.split("x");
          if (width && height) {
            image.resize(parseInt(width), parseInt(height));
          }
        }

        // Apply format conversion if needed
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
          })
          .catch((err) => {
            log("Could not save processed image: " + err.message, res);
            reject("error");
          });
      } catch (err: any) {
        log("Could not process image: " + err.message, res);
        reject("error");
      }
    });
  }

  async serveImage(res?: Response) {
    if (this.files.original.exists) {
      res && res.sendFile(this.files.original.path, { root: "." });
    } else if (this.files.cache.exists) {
      res && res.sendFile(this.files.cache.path, { root: "." });
    } else {
      await this.processImage(res);
    }
  }
}

export default ImageRequest;
