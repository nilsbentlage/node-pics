"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRequest = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imageFolder = "images";
const cacheFolder = ".cache";
const picsRegex = /(?<basename>[A-z/\-][^_]*)(?:_)?(?<dimensions>\d{1,4}x\d{1,4})?(?:\.)(?<format>[a-z]{1,4})/;
class ImageRequest {
    constructor(requested) {
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
                    path: path_1.default.join(imageFolder, this.filename),
                    exists: fs_1.default.existsSync(path_1.default.join(imageFolder, this.filename)),
                    format: this.format,
                },
                cache: {
                    path: path_1.default.join(cacheFolder, this.filename),
                    exists: fs_1.default.existsSync(path_1.default.join(cacheFolder, this.filename)),
                    format: this.format,
                },
                source: {
                    path: fs_1.default
                        .readdirSync(path_1.default.join("images", this.filePath ? this.filePath : ""))
                        .find((foundFile) => foundFile.startsWith(this.basename)),
                    exists: fs_1.default
                        .readdirSync(path_1.default.join("images", this.filePath ? this.filePath : ""))
                        .find((foundFile) => foundFile.startsWith(this.basename))
                        ? true
                        : false,
                    format: fs_1.default
                        .readdirSync(path_1.default.join("images", this.filePath ? this.filePath : ""))
                        .find((foundFile) => foundFile.startsWith(this.basename))
                        ?.split(".")[1],
                },
            };
            console.log(this.refs);
        }
        else {
            throw new Error("The requested filename does not meet our Requirements");
        }
    }
}
exports.ImageRequest = ImageRequest;
console.log("Tests asdasd");
new ImageRequest("test_300x300.jpg");
new ImageRequest("test.jpg");
new ImageRequest("models/test23123.jpg");
new ImageRequest("tester/test2/test_231x231.jpg");
new ImageRequest("tester/test2/test.png");
