import express from "express";
import { renderHome, renderAbout, checkUrl } from "../controllers/indexController.js";
import { checkRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Home page
router.get("/", renderHome);

// Check URL — rate-limited
router.post("/check", checkRateLimiter, checkUrl);

// About page
router.get("/about", renderAbout);

export default router;
