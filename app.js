import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

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
app.use((req, res, next) => {
  res.status(404).render("pages/error", {
    title: "404 - Not Found",
    message: "The page you are looking for does not exist.",
  });
});

// 500 Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {
    title: "500 - Server Error",
    message: "Something went wrong on our end.",
  });
});
