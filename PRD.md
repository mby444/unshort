# Product Requirements Document (PRD)

## Web Unshortener URL — "Reveal Link"

|             |             |
| ----------- | ----------- |
| **Versi**   | 1.0         |
| **Tanggal** | 6 Juli 2026 |
| **Status**  | Draft       |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang

Short link (bit.ly, t.co, tinyurl, dll) banyak digunakan untuk menyingkat URL, namun sering disalahgunakan untuk menyembunyikan tujuan sebenarnya dari sebuah link (phishing, spam, link berbahaya). Pengguna sering ingin tahu ke mana sebuah short link akan mengarah **sebelum** mengkliknya.

### 1.2 Tujuan Produk

Membangun web sederhana yang memungkinkan pengguna menempelkan short link dan mendapatkan URL asli (final destination) tanpa perlu membuka link tersebut secara langsung di browser.

### 1.3 Goals

- Mengungkap URL asli dari short link secara instan
- Menampilkan seluruh jejak redirect (redirect chain / history)
- Memberikan indikasi keamanan dasar terhadap URL final
- Antarmuka simpel, cepat, tanpa perlu login

### 1.4 Non-Goals (Di luar scope versi 1.0)

- Tidak melakukan analisis malware/scanning konten mendalam (hanya deteksi dasar)
- Tidak menyediakan fitur pemendekan URL (shortener) — hanya unshorten
- Tidak ada akun pengguna / autentikasi di versi awal
- Tidak mendukung bulk processing (banyak URL sekaligus) di versi 1.0

---

## 2. Target Pengguna

| Persona                                 | Kebutuhan                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------- |
| Pengguna umum / awam internet           | Ingin memastikan link yang diterima (WA, email, sosmed) aman sebelum diklik |
| Digital marketer / social media manager | Ingin verifikasi link kampanye tim lain sebelum dipublikasi                 |
| Peneliti keamanan / IT support          | Ingin menganalisis redirect chain suatu link dengan cepat                   |

---

## 3. User Stories

| ID    | Sebagai... | Saya ingin...                                             | Sehingga...                                           |
| ----- | ---------- | --------------------------------------------------------- | ----------------------------------------------------- |
| US-01 | Pengguna   | menempelkan short link dan menekan tombol "Cek"           | saya bisa melihat URL asli tanpa membuka link         |
| US-02 | Pengguna   | melihat seluruh rantai redirect (hop 1, 2, 3, dst)        | saya paham proses link tersebut sebelum sampai tujuan |
| US-03 | Pengguna   | menyalin (copy) URL hasil dengan satu klik                | saya bisa langsung memakainya di tempat lain          |
| US-04 | Pengguna   | mendapat peringatan jika URL final terindikasi berbahaya  | saya bisa berhati-hati sebelum membuka link tersebut  |
| US-05 | Pengguna   | melihat riwayat pengecekan sebelumnya (di sesi yang sama) | saya tidak perlu mengecek ulang link yang sama        |

---

## 4. Functional Requirements

### 4.1 Fitur Utama (Must Have — MVP)

**FR-1: Input & Resolve URL**

- Pengguna dapat memasukkan short link melalui input field
- Sistem melakukan validasi format URL sebelum diproses
- Sistem mengikuti redirect secara manual (tanpa auto-follow) hop demi hop
- Sistem mengembalikan URL final beserta status code tiap hop

**FR-2: Redirect Chain Display**

- Menampilkan daftar seluruh URL yang dilalui secara berurutan
- Menampilkan status HTTP code setiap hop (301, 302, 307, 308, 200)

**FR-3: Error Handling**

- Menampilkan pesan error yang jelas jika:
  - URL tidak valid
  - Domain tidak dapat diakses / DNS gagal
  - Request timeout
  - Redirect loop terdeteksi (>10 hop)

**FR-4: Copy to Clipboard**

- Tombol untuk menyalin URL final dengan satu klik

### 4.2 Fitur Tambahan (Should Have)

**FR-5: Basic Safety Check**

- Cek URL final terhadap Google Safe Browsing API (atau layanan sejenis) untuk deteksi phishing/malware dasar
- Tampilkan badge "Aman" / "Waspada" / "Tidak diketahui"

**FR-6: Riwayat Pengecekan (Session-based)**

- Menyimpan daftar link yang sudah dicek dalam sesi browser (local storage), tanpa perlu login

**FR-7: Preview Metadata**

- Menampilkan title & favicon dari domain URL final (jika tersedia)

### 4.3 Fitur Opsional (Could Have — versi mendatang)

**FR-8: REST API Publik**

- Endpoint API yang bisa diakses developer lain (dengan rate limit)

**FR-9: Bulk Check**

- Input banyak URL sekaligus (misal melalui upload CSV)

**FR-10: Browser Extension**

- Ekstensi Chrome/Firefox untuk cek link langsung dari halaman web

---

## 5. Non-Functional Requirements

| Kategori         | Requirement                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Performance**  | Response time rata-rata < 3 detik untuk resolve link dengan maksimal 10 hop               |
| **Scalability**  | Sanggup menangani minimal 100 request bersamaan (concurrent) di awal                      |
| **Security**     | Rate limiting per IP untuk mencegah abuse/scraping massal                                 |
| **Reliability**  | Timeout per hop maksimal 5 detik, total proses maksimal 15 detik                          |
| **Availability** | Target uptime 99%                                                                         |
| **Usability**    | Mobile-responsive, dapat diakses tanpa instalasi apa pun                                  |
| **Privacy**      | Tidak menyimpan URL yang dicek pengguna di server (kecuali untuk keperluan cache singkat) |

---

## 6. User Flow

```
[Landing Page]
     |
     v
[User paste short link] --> [Klik tombol "Cek Link"]
     |
     v
[Validasi format URL] --(invalid)--> [Tampilkan error]
     |
   (valid)
     v
[Sistem resolve redirect hop-by-hop] --(timeout/error)--> [Tampilkan error]
     |
   (sukses)
     v
[Tampilkan hasil:]
  - URL Final
  - Redirect chain (list hop + status code)
  - Safety badge
  - Tombol copy
     |
     v
[Simpan ke riwayat lokal (opsional)]
```

---

## 7. Tech Stack Rekomendasi

| Layer                       | Teknologi                                                | Alasan                                                        |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Frontend                    | Next.js (React) + Tailwind CSS                           | SSR/SSG mudah, satu framework untuk FE & API routes           |
| Backend / API               | Next.js API Routes (atau Node.js + Express jika dipisah) | Simple, cukup untuk skala awal                                |
| HTTP Client                 | `axios` atau `undici`                                    | Kontrol penuh terhadap redirect handling                      |
| Safety Check                | Google Safe Browsing API                                 | Gratis untuk skala kecil, akurat                              |
| Storage riwayat             | localStorage (client-side)                               | Tidak butuh database di awal, privasi terjaga                 |
| Database (opsional, fase 2) | PostgreSQL / Redis (cache)                               | Jika nanti butuh cache hasil resolve & rate limiting terpusat |
| Deployment                  | Vercel                                                   | Deploy Next.js mudah, gratis untuk trafik kecil-menengah      |
| Monitoring                  | Vercel Analytics / Sentry                                | Pantau error & performa produksi                              |

---

## 8. Metrics / Success Criteria

| Metrik                                   | Target                                      |
| ---------------------------------------- | ------------------------------------------- |
| Rata-rata waktu resolve link             | < 3 detik                                   |
| Error rate (gagal resolve)               | < 5% dari total request                     |
| Jumlah pengguna unik per bulan (bulan 1) | Baseline awal, tanpa target spesifik        |
| Uptime layanan                           | ≥ 99%                                       |
| Tingkat penggunaan fitur "safety check"  | Dipantau untuk validasi kebutuhan fitur ini |

---

## 9. Risiko & Mitigasi

| Risiko                                                         | Dampak                                           | Mitigasi                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| Disalahgunakan untuk scraping massal / DDoS pihak ketiga       | Server short link diblokir/rate limit ke IP kita | Terapkan rate limiting per IP pengguna                                      |
| Redirect loop tak berujung                                     | Server hang / timeout                            | Batasi maksimal hop (10) dan timeout per request                            |
| False sense of security (badge "aman" tapi tetap berbahaya)    | Pengguna tertipu                                 | Beri disclaimer bahwa safety check bersifat indikatif, bukan garansi mutlak |
| Beberapa short link memblokir request tanpa User-Agent browser | Gagal resolve                                    | Set User-Agent header yang wajar pada request                               |

---

## 10. Roadmap (Ringkas)

| Fase             | Scope                                               | Estimasi                                         |
| ---------------- | --------------------------------------------------- | ------------------------------------------------ |
| **Fase 1 (MVP)** | FR-1 s.d. FR-4                                      | 1–2 minggu                                       |
| **Fase 2**       | FR-5 s.d. FR-7 (safety check, riwayat, metadata)    | 1–2 minggu                                       |
| **Fase 3**       | FR-8 s.d. FR-10 (API publik, bulk check, extension) | Menyusul berdasarkan validasi kebutuhan pengguna |

---

## 11. Open Questions

- Apakah perlu mendukung short link yang memerlukan JavaScript rendering (misal redirect via meta-refresh/JS, bukan HTTP header)?
- Apakah safety check akan pakai layanan gratis (Google Safe Browsing) atau berbayar (VirusTotal API) untuk akurasi lebih tinggi?
- Apakah dibutuhkan dukungan multi-bahasa (i18n) di versi awal?
