import { Response } from "express";
import { marked } from "marked";
import Cache from "./classes/Cache";
import fs from "fs";

const template = fs.readFileSync("./src/template.html", "utf8");

export function log(message: string, res?: Response) {
  const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
  console.log(`${timeStamp} | ` + message);
  if (res) res.send(`${timeStamp} | ` + message);
}

export async function renderHtmlPage(
  readmeContent: string,
  cache: Cache,
  token?: string
): Promise<string> {
  const htmlContent = marked(readmeContent);
  const data = cache.getHealth();
  const htmlPage = template
    .replace("{{htmlContent}}", htmlContent)
    .replace("{{cacheSize}}", data.cacheSize)
    .replace("{{filesInCache}}", data.filesInCache.toString())
    .replace("{{uptime}}", data.uptime.toString())
    .replace("{{token}}", token || "");

  return htmlPage;
}
