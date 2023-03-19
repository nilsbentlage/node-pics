"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = require("path");
const fs_1 = require("fs");
const util_js_1 = __importDefault(require("./util.js"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/:imageName(*)", async (req, res) => {
    const imageName = req.params.imageName;
    const fileExtension = imageName.split(".")[imageName.split(".").length - 1];
    const filePathSource = (0, path_1.join)("images/", imageName);
    const filePathCache = (0, path_1.join)(".cache/", imageName.replaceAll("/", "-"));
    const fileInSource = (0, fs_1.existsSync)(filePathSource);
    const fileInCache = (0, fs_1.existsSync)(filePathCache);
    const sizeRegex = /\d{1,4}x\d{1,4}/;
    const sizeString = imageName.match(sizeRegex);
    const [imageWidth, imageHeight] = (sizeString && sizeString[0].split("x")) || [];
    const begin = new Date();
    const isAvailable = !fileInCache && !fileInSource;
    if (isAvailable) {
        const basename = imageName
            .replace(/_(\d+)x(\d+)/, "")
            .replace(/\.(\w+)/, "");
        const sourceImagePath = (0, path_1.join)("images");
        const sourceImages = (0, fs_1.readdirSync)(sourceImagePath);
        const sourceImage = sourceImages.find((image) => {
            return image.startsWith(basename);
        });
        if (!sourceImage) {
            res.send("Source Image: " + imageName + " was not found!");
            (0, util_js_1.default)("Source Image: " + imageName + " was not found!");
            return;
        }
        try {
            const sourceFileExtension = sourceImage.split(".")[1];
            const image = (0, sharp_1.default)((0, path_1.join)(sourceImagePath, sourceImage));
            if (imageWidth && imageHeight) {
                image.resize(parseInt(imageWidth), parseInt(imageHeight));
            }
            if (fileExtension !== sourceFileExtension) {
                image.toFormat("." + fileExtension === "jpg" ? "jpeg" : fileExtension);
            }
            image.toFile(filePathCache).then(() => {
                res.sendFile(filePathCache, { root: "." });
            });
        }
        catch (err) {
            (0, util_js_1.default)("Could not create Image: " + err.message);
            res("Could not create Image: " + err.message);
        }
    }
    else {
        res.sendFile(fileInCache ? filePathCache : filePathSource, { root: "." });
    }
    (0, util_js_1.default)(`Handled Request: ${imageName} in ${new Date() - begin}ms ${isAvailable ? "(incl. conversion to " + fileExtension + ")" : ""}`);
});
app.listen(port, () => {
    (0, util_js_1.default)(`P.I.C.S listening on port ${port}`);
});
