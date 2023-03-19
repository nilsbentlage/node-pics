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
class ImageRequest {
    constructor(requested) {
        const picsRegex = /([^_]*)(?:(?:_)(?:(\d{1,4})x(\d{1,4})))?\.([a-z]{1,4})/;
        const regexArray = requested.match(picsRegex);
        if (regexArray) {
            [this.filename, this.basename, this.width, this.height, this.format] =
                regexArray || new Array(5).fill(null);
        }
        else {
            throw new Error("The requested filename does not meet our Requirements");
        }
    }
    fileInCache() {
        if (fs_1.default.existsSync(path_1.default.join(cacheFolder, this.filename))) {
            return path_1.default.join(cacheFolder, this.filename);
        }
        else {
            return false;
        }
    }
    fileInSource() {
        if (fs_1.default.existsSync(path_1.default.join(imageFolder, this.filename))) {
            return path_1.default.join(imageFolder, this.filename);
        }
        else {
            return false;
        }
    }
}
exports.ImageRequest = ImageRequest;
console.log("Tests asdasd");
new ImageRequest("test_300x300.jpg");
new ImageRequest("test23123.jpg");
new ImageRequest("models/test23123.jpg");
new ImageRequest("models/test_231x231.jpg");
