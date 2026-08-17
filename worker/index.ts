/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const cleanRouteAssets: Record<string, string> = {
  "/storyone": "/page60743599.html",
  "/storytwo": "/page60743735.html",
  "/storythree": "/page60743815.html",
  "/storyfour": "/page60744055.html",
  "/storyfive": "/page60744079.html",
  "/storysix": "/page60744097.html",
  "/emdr_method": "/page60745125.html",
  "/ifs-therapy": "/page60745107.html",
  "/imtt_method": "/page60745131.html",
  "/check-lists": "/page60828957.html",
  "/check-list-1": "/page60765633.html",
  "/check-list-2": "/page60830187.html",
  "/check-list-3": "/page60830221.html",
  "/check-list-4": "/page60830241.html",
  "/contact": "/page60746837.html",
  "/blog": "/page61113071.html",
  "/privacy-policy": "/privacy-policy.html",
  "/personal-data-consent": "/personal-data-consent.html",
};

const rootRedirects = new Set([
  "/index",
  "/index.html",
  "/page59763139",
  "/page59763139.html",
  "/page61140643",
  "/page61140643.html",
]);

function normalizedPath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function isProductionHost(hostname: string): boolean {
  return hostname === "valerya-fridlender.ru" || hostname === "www.valerya-fridlender.ru";
}

function withPreviewRobots(response: Response, hostname: string): Response {
  if (isProductionHost(hostname)) return response;
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = normalizedPath(url.pathname);

    if (rootRedirects.has(pathname)) {
      return Response.redirect(new URL("/", url), 301);
    }

    const assetPath = cleanRouteAssets[pathname];
    if (assetPath) {
      const assetUrl = new URL(assetPath, url);
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      return withPreviewRobots(response, url.hostname);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withPreviewRobots(response, url.hostname);
    }

    const response = await handler.fetch(request, env, ctx);
    return withPreviewRobots(response, url.hostname);
  },
};

export default worker;
