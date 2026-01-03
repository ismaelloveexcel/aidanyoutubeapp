import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();

// Security headers with helmet
// NOTE: CSP is disabled in development to allow Vite HMR (hot module replacement) to work.
// In production (NODE_ENV=production), strict CSP is enforced.
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    }
  } : false, // CSP disabled in development only - see note above
}));

// CORS configuration - in production, require explicit ALLOWED_ORIGINS
const getCorsOrigin = (): string[] | boolean | ((origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => void) => {
  if (process.env.NODE_ENV !== "production") {
    return true; // Allow all origins in development
  }
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  if (allowedOrigins) {
    return allowedOrigins.split(',').map(o => o.trim());
  }
  // Same-origin only: allow requests with no origin (same-origin) or matching host
  console.warn('⚠️ ALLOWED_ORIGINS not set in production - CORS will only allow same-origin requests');
  return (origin, callback) => {
    // Allow requests with no origin (same-origin requests from browser)
    if (!origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed - set ALLOWED_ORIGINS environment variable'));
    }
  };
};

app.use(cors({
  origin: getCorsOrigin(),
  credentials: true,
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Separate rate limiter for health check endpoint (more permissive for monitoring tools)
const healthLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Allow 60 requests per minute (1 per second average)
  message: { error: "Too many health check requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/health", healthLimiter);

// Request body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const server = createServer(app);
  await registerRoutes(server, app);

  const PORT = process.env.PORT || 5000;

  if (process.env.NODE_ENV !== "production") {
    // Disable caching in development to ensure users always see latest changes
    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      next();
    });
    
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist/public
    // When running from dist/index.cjs, currentDir is the dist directory
    const publicDir = path.resolve(currentDir, "public");
    app.use(express.static(publicDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(publicDir, "index.html"));
    });
  }

  server.listen(PORT, () => {
    console.log(`🚀 TubeStar Creator Studio server running on port ${PORT}`);
  });
})();
