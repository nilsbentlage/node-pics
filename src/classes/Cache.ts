import fs from "fs";

class Cache {
  private directory: string;

  constructor(directory: string) {
    this.directory = directory;
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory);
    }
  }

  private getFiles() {
    return fs.readdirSync(this.directory);
  }

  public getFileCount() {
    return this.getFiles().length;
  }

  public getDiskUsage(): string {
    let bytes = this.getFiles().reduce(
      (acc, file) => acc + fs.statSync(this.directory + "/" + file).size,
      0
    );
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return bytes.toFixed(2) + " " + units[i];
  }

  public getDirectory() {
    return this.directory;
  }

  public clear() {
    fs.rmdirSync(this.directory, { recursive: true });
    fs.mkdirSync(this.directory);
  }

  public getHealth() {
    return {
      filesInCache: this.getFileCount(),
      cacheSize: this.getDiskUsage(),
      uptime: process.uptime().toFixed(2),
    };
  }
}

export default Cache;
