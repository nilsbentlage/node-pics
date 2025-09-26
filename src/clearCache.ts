import fs from "fs";
import path from "path";
import log from "./util";

const directory = ".cache";

export default function clearCache() {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (!file.endsWith(".gitkeep")) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    }
    log(`Deleted ${files.length - 1} File(s)`);
  });
}
