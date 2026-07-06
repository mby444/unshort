import axios from "axios";

/**
 * Memeriksa keamanan URL menggunakan Google Safe Browsing API v5
 *
 * @param {string} url - URL final yang akan dicek
 * @param {boolean} enabled - Apakah fitur safety check diaktifkan oleh pengguna
 * @returns {Promise<{ status: 'safe' | 'warning' | 'unknown', label: string, detail: string }>}
 */
export async function checkSafety(url, enabled = false) {
  if (!enabled) {
    return {
      status: "unknown",
      label: "Tidak Diketahui",
      detail: "Pemeriksaan keamanan dinonaktifkan oleh pengguna.",
    };
  }

  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!apiKey) {
    return {
      status: "unknown",
      label: "Tidak Diketahui",
      detail: "API Key Google Safe Browsing tidak ditemukan di server.",
    };
  }

  try {
    const res = await axios.get(
      `https://safebrowsing.googleapis.com/v5/urls:search`,
      {
        params: {
          urls: url,
          key: apiKey,
        },
        responseType: "arraybuffer",
        timeout: 3000,
      },
    );

    // API v5 mengembalikan protobuf. Response kosong (safe) berukuran sekitar 5 bytes.
    // Jika ada ancaman, response akan berisi detail threat match yang jauh lebih besar.
    if (res.data.byteLength > 10) {
      return {
        status: "warning",
        label: "Berbahaya",
        detail: "URL ini terdeteksi tidak aman oleh Google Safe Browsing.",
      };
    }

    return {
      status: "safe",
      label: "Aman",
      detail: "Tidak ditemukan ancaman keamanan pada URL ini.",
    };
  } catch (error) {
    console.error("Safety check API v5 error:", error.message);
    return {
      status: "unknown",
      label: "Tidak Diketahui",
      detail: "Gagal memverifikasi keamanan karena gangguan jaringan/API.",
    };
  }
}
