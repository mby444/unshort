import { unshortenUrl, UnshortError } from "../lib/unshort.js";
import { checkSafety } from "../lib/safetyCheck.js";
import { getMetadata } from "../lib/metadata.js";

/**
 * Renders the home page (no result, no error — handled client-side via axios)
 */
export const renderHome = (req, res) => {
  res.render("pages/index", {
    title: "Reveal Link — Ungkap URL Asli di Balik Short Link",
  });
};

/**
 * POST /check — resolves a short URL and returns JSON
 * Called via axios from the frontend (no page refresh)
 */
export const checkUrl = async (req, res) => {
  const { url } = req.body;
  const inputUrl = (url || "").trim();

  if (!inputUrl) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_URL", message: "URL tidak boleh kosong." },
    });
  }

  try {
    const { finalUrl, chain } = await unshortenUrl(inputUrl);

    // Run safety check and metadata fetch in parallel (both non-critical)
    const [safety, metadata] = await Promise.allSettled([
      checkSafety(finalUrl),
      getMetadata(finalUrl),
    ]);

    return res.json({
      success: true,
      result: {
        finalUrl,
        chain,
        safety:
          safety.status === "fulfilled"
            ? safety.value
            : { status: "unknown", label: "Tidak Diketahui", detail: "" },
        metadata:
          metadata.status === "fulfilled"
            ? metadata.value
            : { title: null, faviconUrl: null },
      },
    });
  } catch (err) {
    const message =
      err instanceof UnshortError
        ? err.message
        : "Terjadi kesalahan tidak terduga. Silakan coba lagi.";
    const code = err instanceof UnshortError ? err.code : "UNKNOWN";

    return res.status(422).json({
      success: false,
      error: { code, message },
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
