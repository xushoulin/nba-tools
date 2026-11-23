// Minimal static server for the exported site (.next-export).
// `next start` cannot serve a project built with `output: "export"`, so this
// mirrors how GitHub Pages serves the site: the export is mounted at /nba-tools.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".next-export");
const BASE = "/nba-tools";
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!fs.existsSync(path.join(ROOT, "index.html"))) {
  console.error(`No static export found in ${ROOT}. Run "npm run build" first.`);
  process.exit(1);
}

function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath);
  const full = path.join(ROOT, rel);
  if (!full.startsWith(ROOT)) return null; // path traversal guard
  const candidates = [full, `${full}.html`, path.join(full, "index.html")];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (pathname === BASE) {
    res.writeHead(301, { Location: `${BASE}/${url.search}` });
    return res.end();
  }

  if (!pathname.startsWith(`${BASE}/`)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Not found. The site is served under ${BASE}/`);
  }

  pathname = pathname.slice(BASE.length);
  const file = resolveFile(pathname);

  if (!file) {
    const notFound = resolveFile("/404.html");
    res.writeHead(404, { "Content-Type": MIME[".html"] });
    res.end(notFound ? fs.readFileSync(notFound) : "404 Not Found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
    // Mirror GitHub Pages' caching behaviour closely enough for local checks.
    "Cache-Control": file.includes(`${path.sep}_next${path.sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Static export preview: http://localhost:${PORT}${BASE}/`);
});
