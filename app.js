import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";

// ES module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy headers (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Setup View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render("pages/error", {
    title: "404 — Halaman Tidak Ditemukan",
    message: "Halaman yang Anda cari tidak ada.",
  });
});

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {
    title: "500 — Kesalahan Server",
    message: "Terjadi kesalahan pada server kami.",
  });
});

export default app;
