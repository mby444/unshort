/**
 * Basic Safety Check — Fase 2
 *
 * Saat ini hanya mengembalikan badge "unknown" (Google Safe Browsing API di-skip).
 * Struktur sudah siap untuk ditambahkan integrasi API di masa mendatang.
 *
 * @param {string} _url - URL final yang akan dicek
 * @returns {{ status: 'safe' | 'warning' | 'unknown', label: string, detail: string }}
 */
export async function checkSafety(_url) {
  // TODO (Fase 3): Integrasi Google Safe Browsing API
  // const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  // if (apiKey) { ... }

  return {
    status: "unknown",
    label: "Tidak Diketahui",
    detail: "Pemeriksaan keamanan otomatis belum tersedia.",
  };
}
