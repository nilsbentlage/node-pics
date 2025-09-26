import { Response } from "express";
import { marked } from "marked";
import Cache from "./classes/Cache";

export function log(message: string, res?: Response) {
  const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
  console.log(`${timeStamp} | ` + message);
  if (res) res.send(`${timeStamp} | ` + message);
}

export async function renderHtmlPage(
  readmeContent: string,
  cache: Cache
  token?: string,
): Promise<string> {
  const htmlContent = marked(readmeContent);
  const data = cache.getHealth();
  const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node-pics - Help & Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .api-endpoint {
            background: #e8f5e8;
            padding: 10px;
            border-left: 4px solid #4caf50;
            margin: 10px 0;
        }
        .clear-cache-button {
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 0;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            align-items: center;
        }
    </style>
    <script defer>
            document.addEventListener("DOMContentLoaded", function() {
                const button = document.querySelector("button");
                button.addEventListener("click", function(event) {
                    let token = "${token}";
                    if (!token || token.length === 0) {
                        token = window.prompt("Please enter your token:");
                    }
                    const headers = {
                        "Authorization": "Bearer " + token
                    };

                    fetch("/clear", {
                        method: "DELETE",
                        headers: headers
                    })
                    .then(response => {
                        if (response.ok) {
                            alert("Cache cleared successfully");
                        } else {
                            alert("Failed to clear cache");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("An error occurred");
                    });
                });
            });
    </script>
</head>
<body>
    <div class="header">
        <h1>🖼️ Node-pics Documentation</h1>
        <p>Pure Image Compression | Conversion | Caching Server</p>
    </div>
    ${htmlContent}
    <hr>
    <details>
    <summary style="cursor: pointer;"><h2 style="display: inline-block; margin-block: 0.25rem 0.5rem;">System Information</h2></summary>
    <div class="row">
        <span><b>Cache Size:</b> ${data.cacheSize}</span>
        <span><b>Files in Cache:</b> ${data.filesInCache}</span>
        <span><b>Uptime:</b> ${data.uptime}s</span>
        <button class="clear-cache-button" type="button">Clear Cache</button>
    </div>
    </details>
    <hr>
    <p style="text-align: center; color: #666; margin-top: 30px;">
        <small>This documentation is automatically generated from the README.md file</small>
    </p>
</body>
</html>`;

  return htmlPage;
}
