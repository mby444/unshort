import { unshortenUrl, UnshortError } from "../lib/unshort.js";
import { checkSafety } from "../lib/safetyCheck.js";
import { getMetadata } from "../lib/metadata.js";

/**
 * Renders the home page
 */
export const renderHome = (req, res) => {
  res.render("pages/index", {
    title: "Reveal Link — Ungkap URL Asli di Balik Short Link",
    result: null,
    error: null,
    inputUrl: "",
  });
};

/**
 * Handles POST /check — resolves a short URL and renders results
 */
export const checkUrl = async (req, res) => {
  const { url } = req.body;
  const inputUrl = (url || "").trim();

  // Basic empty check before calling the lib
  if (!inputUrl) {
    return res.render("pages/index", {
      title: "Reveal Link — Ungkap URL Asli di Balik Short Link",
      result: null,
      error: { code: "INVALID_URL", message: "URL tidak boleh kosong." },
      inputUrl: "",
    });
  }

  try {
    // Resolve the URL
    const { finalUrl, chain } = await unshortenUrl(inputUrl);

    // Run safety check and metadata fetch in parallel (both non-critical)
    const [safety, metadata] = await Promise.allSettled([
      checkSafety(finalUrl),
      getMetadata(finalUrl),
    ]);

    return res.render("pages/index", {
      title: "Reveal Link — Ungkap URL Asli di Balik Short Link",
      result: {
        finalUrl,
        chain,
        safety: safety.status === "fulfilled" ? safety.value : { status: "unknown", label: "Tidak Diketahui", detail: "" },
        metadata: metadata.status === "fulfilled" ? metadata.value : { title: null, faviconUrl: null },
      },
      error: null,
      inputUrl,
    });
  } catch (err) {
    const errorMessage =
      err instanceof UnshortError
        ? err.message
        : "Terjadi kesalahan tidak terduga. Silakan coba lagi.";

    const errorCode = err instanceof UnshortError ? err.code : "UNKNOWN";

    return res.render("pages/index", {
      title: "Reveal Link — Ungkap URL Asli di Balik Short Link",
      result: null,
      error: { code: errorCode, message: errorMessage },
      inputUrl,
    });
  }
};

/**
 * Renders the about page
 */
export const renderAbout = (req, res) => {
  res.render("pages/about", {
    title: "Tentang — Reveal Link",
    activePage: "about",
  });
};
