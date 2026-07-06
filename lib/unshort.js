import axiosInstance from "../config/axios.js";

/**
 * Custom error class for URL resolution failures
 */
export class UnshortError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "UnshortError";
    this.code = code; // 'INVALID_URL' | 'REDIRECT_LOOP' | 'MAX_HOPS' | 'TIMEOUT' | 'DNS_FAIL' | 'NETWORK_ERROR'
  }
}

/**
 * Resolves a short URL by following redirects hop by hop.
 * @param {string} inputUrl - The URL to resolve
 * @returns {{ finalUrl: string, chain: Array<{ url: string, statusCode: number }> }}
 */
export async function unshortenUrl(inputUrl) {
  // Validate URL format
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    throw new UnshortError("Format URL tidak valid.", "INVALID_URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new UnshortError(
      "URL harus menggunakan protokol http atau https.",
      "INVALID_URL"
    );
  }

  const MAX_HOPS = 10;
  const visitedUrls = new Set();
  const chain = [];
  let currentUrl = inputUrl;

  for (let i = 0; i < MAX_HOPS; i++) {
    // Detect redirect loop
    if (visitedUrls.has(currentUrl)) {
      throw new UnshortError(
        `Redirect loop terdeteksi setelah ${i} hop.`,
        "REDIRECT_LOOP"
      );
    }
    visitedUrls.add(currentUrl);

    let response;
    try {
      response = await axiosInstance.get(currentUrl, {
        maxRedirects: 0,
        // Accept ALL status codes — we decide what's a redirect vs final destination
        validateStatus: () => true,
      });
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
        throw new UnshortError(
          `Request timeout pada hop ke-${i + 1}: ${currentUrl}`,
          "TIMEOUT"
        );
      }
      if (
        err.code === "ENOTFOUND" ||
        err.code === "EAI_AGAIN" ||
        err.code === "ECONNREFUSED"
      ) {
        throw new UnshortError(
          `Domain tidak dapat diakses: ${new URL(currentUrl).hostname}`,
          "DNS_FAIL"
        );
      }
      throw new UnshortError(
        `Gagal terhubung ke ${currentUrl}: ${err.message}`,
        "NETWORK_ERROR"
      );
    }

    const statusCode = response.status;
    const location = response.headers.location;
    const isRedirect = statusCode >= 300 && statusCode < 400 && !!location;

    // Push current hop into chain
    chain.push({ url: currentUrl, statusCode });

    // Not a redirect — this is the final URL
    if (!isRedirect) {
      return { finalUrl: currentUrl, chain };
    }

    // Resolve relative redirects
    currentUrl = new URL(location, currentUrl).toString();
  }

  // Pushed last URL before hitting max hops
  throw new UnshortError(
    `Melebihi batas maksimal ${MAX_HOPS} redirect.`,
    "MAX_HOPS"
  );
}
