import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = await realpath(fileURLToPath(new URL("../dist", import.meta.url)));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const config = JSON.parse(await readFile(resolve(root, "staticwebapp.config.json"), "utf8"));
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const candidate = resolve(
      root,
      "." + (pathname.endsWith("/") ? pathname + "index.html" : pathname),
    );
    if (!candidate.startsWith(root + sep)) throw new Error("Caminho inválido");
    const path = await realpath(candidate);
    if (!path.startsWith(root + sep)) throw new Error("Caminho inválido");
    const body = await readFile(path);
    res.writeHead(200, {
      ...config.globalHeaders,
      "Content-Type": mime[extname(path)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Página não encontrada");
  }
}).listen(4173, "127.0.0.1", () => console.log("Prévia local: http://127.0.0.1:4173"));
