import fs from "fs";
import path from "path";

const imageFolder = "images";
const cacheFolder = ".cache";

const picsRegex =
  /(?<basename>[A-z/\-][^_]*)(?:_)?(?<dimensions>\d{1,4}x\d{1,4})?(?:\.)(?<format>[a-z]{1,4})/;

export class ImageRequest {
  filename!: string;
  basename!: string;
  filePath?: string;
  dimensions: string;
  format!: string;
  refs?;

  constructor(requested: string) {
    const regexArray = requested.match(picsRegex);
    if (regexArray) {
      [this.filename, this.basename, this.dimensions, this.format] =
        regexArray || new Array(4).fill(null);
      if (this.basename.includes("/")) {
        this.basename = this.basename.split("/").pop() || this.basename;
        this.filePath = this.basename
          .split("/", this.basename.split("/").length - 1)
          .join("/");
      }
      this.refs = {
        original: {
          path: path.join(imageFolder, this.filename),
          exists: fs.existsSync(path.join(imageFolder, this.filename)),
          format: this.format,
        },
        cache: {
          path: path.join(cacheFolder, this.filename),
          exists: fs.existsSync(path.join(cacheFolder, this.filename)),
          format: this.format,
        },
        source: {
          path: fs
            .readdirSync(
              path.join("images", this.filePath ? this.filePath : "")
            )
            .find((foundFile) => foundFile.startsWith(this.basename)),
          exists: fs
            .readdirSync(
              path.join("images", this.filePath ? this.filePath : "")
            )
            .find((foundFile) => foundFile.startsWith(this.basename))
            ? true
            : false,
          format: fs
            .readdirSync(
              path.join("images", this.filePath ? this.filePath : "")
            )
            .find((foundFile) => foundFile.startsWith(this.basename))
            ?.split(".")[1],
        },
      };
      console.log(this.refs);
    } else {
      throw new Error("The requested filename does not meet our Requirements");
    }
  }
}

console.log("Tests asdasd");
new ImageRequest("test_300x300.jpg");
new ImageRequest("test.jpg");
new ImageRequest("models/test23123.jpg");
new ImageRequest("tester/test2/test_231x231.jpg");
new ImageRequest("tester/test2/test.png");
