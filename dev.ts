import { join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 3000);
const DIST_ROOT = "dist";

const mimeByExt: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const withContentType = (path: string) => {
  const dot = path.lastIndexOf(".");
  const ext = dot >= 0 ? path.slice(dot) : "";
  return mimeByExt[ext] || "application/octet-stream";
};

const resolveSafeDistPath = (pathname: string) => {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const decoded = decodeURIComponent(requested);

  // Normalize path so traversal attempts collapse into a stable form.
  const normalized = normalize(decoded).replace(/^([/\\])+/, "");
  if (!normalized || normalized === ".") {
    return join(DIST_ROOT, "index.html");
  }

  // Reject any path that still attempts to escape the dist root.
  if (
    normalized.startsWith("..") ||
    normalized.includes("/..") ||
    normalized.includes("\\..")
  ) {
    return null;
  }

  return join(DIST_ROOT, normalized);
};

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    const path = resolveSafeDistPath(url.pathname);
    if (!path) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(path);
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file, {
      headers: {
        "content-type": withContentType(path),
      },
    });
  },
});

console.log(`Dev server running at http://localhost:${PORT}`);
