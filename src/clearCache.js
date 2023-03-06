const fs = require("fs");
const path = require("path");

const directory = ".cache";

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    if (file.endsWith('.gitkeep')) return;
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});