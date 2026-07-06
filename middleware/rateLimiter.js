import rateLimit from "express-rate-limit";

/**
 * Rate limiter for the /check endpoint.
 * Limits each IP to 15 requests per minute.
 */
export const checkRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    code: "RATE_LIMITED",
    message:
      "Terlalu banyak permintaan. Harap tunggu beberapa saat sebelum mencoba lagi.",
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});
