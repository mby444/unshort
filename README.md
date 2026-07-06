# Unshort One

Unshort One adalah aplikasi web gratis untuk mengungkap URL asli di balik short link (seperti bit.ly, tinyurl, t.co, dll) tanpa harus mengkliknya secara langsung. Aplikasi ini akan menampilkan seluruh rantai pengalihan (redirect chain) dan juga dapat mengecek keamanan tautan tersebut menggunakan **Google Safe Browsing API**.

## Fitur Utama

- **Ungkap URL Asli:** Mengetahui tujuan akhir (final destination) dari short link.
- **Redirect Chain:** Menampilkan setiap langkah redirect beserta status kode HTTP-nya (301, 302, dsb).
- **Pemeriksaan Keamanan (Opsional):** Mengecek indikasi _phishing_ atau _malware_ pada URL final melalui integrasi Google Safe Browsing v5.
- **Riwayat Pengecekan:** Menyimpan history pencarian URL secara otomatis pada penyimpanan lokal (_localStorage_) tanpa perlu login.
- **Preview Metadata:** Otomatis mengambil judul halaman dan favicon dari tujuan URL (jika memungkinkan).
- **Salin URL:** Salin URL final dengan satu klik.

## Teknologi yang Digunakan

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Templating), Tailwind CSS (via CDN), Vanilla JavaScript
- **HTTP Client:** Axios (untuk redirect tracer & API calls)
- **Keamanan API:** Google Safe Browsing API v5, `express-rate-limit`
- **Konfigurasi Server:** Vercel (didukung file `vercel.json` dan `app.js` module)

## Prasyarat

- [Node.js](https://nodejs.org/) v16 atau lebih baru.
- NPM atau Yarn.
- (Opsional) Google Cloud Console API Key untuk integrasi Safe Browsing.

## Instalasi & Menjalankan secara Lokal

1. **Clone repository** (atau ekstrak source code).

   ```bash
   git clone <url-repo-anda>
   cd unshort
   ```

2. **Install dependensi**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**
   Buat file `.env` di _root_ folder proyek. Tambahkan API Key Anda:

   ```env
   GOOGLE_SAFE_BROWSING_KEY=api_key_google_cloud_anda
   ```

   _(Catatan: Aplikasi akan tetap berfungsi jika API Key tidak disediakan. Jika tidak ada, fitur keamanan akan secara halus dilompati (bypassed) dan memunculkan status "Tidak Diketahui")._

4. **Jalankan Aplikasi**

   Untuk mode _development_ (otomatis restart jika ada perubahan dengan `nodemon`):

   ```bash
   npm run dev
   ```

   Untuk mode _production_:

   ```bash
   npm start
   ```

5. Buka browser dan kunjungi `http://localhost:3000`.

## Privasi dan Data

Unshort One didesain mengutamakan privasi pengguna. **Tidak ada data URL yang dimasukkan pengguna disimpan secara permanen di database server.** Riwayat pengecekan (history) sepenuhnya disimpan secara lokal di dalam _browser_ pengguna.

## Lisensi

Lisensi MIT. Anda bebas memodifikasi dan mengembangkan proyek ini.
