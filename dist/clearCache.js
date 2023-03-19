"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("./util"));
const directory = ".cache";
fs_1.default.readdir(directory, (err, files) => {
    if (err)
        throw err;
    for (const file of files) {
        if (!file.endsWith(".gitkeep")) {
            fs_1.default.unlink(path_1.default.join(directory, file), (err) => {
                if (err)
                    throw err;
            });
        }
    }
    (0, util_1.default)(`Deleted ${files.length - 1} File(s)`);
});
