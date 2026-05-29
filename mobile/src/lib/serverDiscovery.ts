const DEFAULT_PORT = 4000;
const HEALTH_PATH = "/health";
const GRAPHQL_PATH = "/graphql";
const SCAN_TIMEOUT_MS = 2500; // Generous timeout for production APK networking
const PROBE_TIMEOUT_MS = 4000; // Even more generous for manual URL validation

/**
 * Custom Promise.any polyfill (not available in older Hermes engines)
 */
function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    const errors: any[] = [];
    if (promises.length === 0) {
      reject(new Error("Empty promise array"));
      return;
    }
    promises.forEach((p, index) => {
      p.then(resolve).catch((err) => {
        errors[index] = err;
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject(new Error("All promises rejected"));
        }
      });
    });
  });
}

/**
 * Normalize a user-entered URL to ensure it has the correct port and path.
 * e.g. "192.168.1.57" => "http://192.168.1.57:4000/graphql"
 *      "http://192.168.1.57" => "http://192.168.1.57:4000/graphql"
 *      "http://192.168.1.57:4000" => "http://192.168.1.57:4000/graphql"
 *      "brainblitz-production.up.railway.app" => "https://brainblitz-production.up.railway.app/graphql"
 */
export function normalizeServerUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, "");

  const isHttps = /^https:\/\//i.test(url);
  const isRailway = /railway\.app/i.test(url);

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    // If it's a railway URL or looks like a public domain, default to https
    if (isRailway || (!/^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/i.test(url) && url.includes('.'))) {
      url = `https://${url}`;
    } else {
      url = `http://${url}`;
    }
  }

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    // Determine if we should append the default port 4000.
    // We should NOT append port 4000 if:
    // 1. A port is already specified
    // 2. The URL is https:// (usually standard 443)
    // 3. It's a Railway app or public domain (does not look like localhost/IP)
    const isLocalHostOrIp = /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/i.test(hostname);
    const isPublicDomain = hostname.includes('.') && !isLocalHostOrIp;
    
    if (!parsed.port && parsed.protocol !== "https:" && !isPublicDomain && !isRailway) {
      parsed.port = String(DEFAULT_PORT);
    }
    
    // Ensure the path ends with /graphql
    if (!parsed.pathname.includes("graphql")) {
      parsed.pathname = GRAPHQL_PATH;
    }
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    // If URL parsing fails, try a basic approach
    if (!url.includes(`:${DEFAULT_PORT}`) && !isHttps && !isRailway) {
      url += `:${DEFAULT_PORT}`;
    }
    if (!url.includes("/graphql")) {
      url += GRAPHQL_PATH;
    }
    return url;
  }
}

/**
 * Extract the base URL (protocol + host + port) from a full URL.
 */
function getBaseUrl(fullUrl: string): string {
  try {
    const parsed = new URL(fullUrl);
    const hostname = parsed.hostname;
    const isLocalHostOrIp = /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/i.test(hostname);
    const isRailway = /railway\.app/i.test(hostname);
    const isPublicDomain = hostname.includes('.') && !isLocalHostOrIp;
    
    if (parsed.port) {
      return `${parsed.protocol}//${parsed.hostname}:${parsed.port}`;
    } else if (parsed.protocol === "https:" || isPublicDomain || isRailway) {
      return `${parsed.protocol}//${parsed.hostname}`;
    } else {
      return `${parsed.protocol}//${parsed.hostname}:${DEFAULT_PORT}`;
    }
  } catch {
    return fullUrl.replace(/\/graphql.*$/, "");
  }
}

/**
 * Probe a single server to check if BrainBlitz backend is running.
 * Returns the GraphQL URL if reachable, null otherwise.
 */
async function probeHealth(
  baseUrl: string,
  timeoutMs: number = SCAN_TIMEOUT_MS
): Promise<string | null> {
  try {
    const healthUrl = baseUrl.replace(/\/+$/, "") + HEALTH_PATH;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(healthUrl, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "ok") {
        return baseUrl.replace(/\/+$/, "") + GRAPHQL_PATH;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate a user-entered URL by probing the health endpoint.
 * Normalizes the URL first (adds port/path if needed).
 * Returns the normalized GraphQL URL if valid, null otherwise.
 */
export async function probeServer(rawUrl: string): Promise<string | null> {
  const normalized = normalizeServerUrl(rawUrl);
  const base = getBaseUrl(normalized);
  return probeHealth(base, PROBE_TIMEOUT_MS);
}

/**
 * Scans common subnets IN PARALLEL for a running BrainBlitz backend.
 * All subnets are scanned concurrently for maximum speed.
 */
export async function discoverLocalServer(
  progressCallback?: (status: string) => void
): Promise<string | null> {
  const subnets = [
    "192.168.1",
    "192.168.0",
    "192.168.100",
    "192.168.50",
    "192.168.2",
    "192.168.254",
    "10.0.0",
    "10.0.1",
    "172.16.0",
  ];

  if (progressCallback) {
    progressCallback("SCANNING NETWORK...");
  }

  // Fire ALL subnet scans in parallel for speed
  const allPromises: Promise<string>[] = [];

  for (const subnet of subnets) {
    for (let i = 1; i <= 254; i++) {
      const ip = `${subnet}.${i}`;
      const baseUrl = `http://${ip}:${DEFAULT_PORT}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);

      allPromises.push(
        fetch(baseUrl + HEALTH_PATH, {
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" },
        })
          .then(async (res) => {
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data && data.status === "ok") {
                if (progressCallback) {
                  progressCallback(`FOUND: ${ip}`);
                }
                return `http://${ip}:${DEFAULT_PORT}${GRAPHQL_PATH}`;
              }
            }
            throw new Error("Not BrainBlitz");
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            return Promise.reject(err);
          })
      );
    }
  }

  try {
    // promiseAny resolves as soon as ANY one succeeds
    const discovered = await promiseAny(allPromises);
    return discovered;
  } catch {
    return null;
  }
}
