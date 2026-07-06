import axiosInstance from "../config/axios.js";

/**
 * Fetches page title and favicon URL from the final destination URL.
 * Uses plain HTTP GET — no JS rendering needed.
 *
 * @param {string} url - Final resolved URL
 * @returns {{ title: string|null, faviconUrl: string|null }}
 */
export async function getMetadata(url) {
  try {
    const response = await axiosInstance.get(url, {
      maxRedirects: 5,
      responseType: "text",
      headers: {
        Accept: "text/html",
      },
      // Limit response size — only need <head>, not the whole page
      maxContentLength: 150 * 1024, // 150 KB
    });

    const html = response.data;

    // Extract <title>
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().slice(0, 120) : null;

    // Extract favicon from <link rel="icon"> or <link rel="shortcut icon">
    const faviconMatch = html.match(
      /<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]+href=["']([^"']+)["']/i
    );
    let faviconUrl = null;
    if (faviconMatch) {
      faviconUrl = new URL(faviconMatch[1], url).toString();
    } else {
      // Fallback: standard /favicon.ico
      const { origin } = new URL(url);
      faviconUrl = `${origin}/favicon.ico`;
    }

    return { title, faviconUrl };
  } catch {
    // Silently fail — metadata is non-critical
    return { title: null, faviconUrl: null };
  }
}
