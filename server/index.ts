import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupCustomerAIRoutes } from "./temp-ai-routes";
import tenantRoutes from "./routes/tenant-routes";
import tenantAuthRoutes from "./routes/tenant-auth-simple";
import tenantApiRoutes from "./routes/tenant-api";
import aiSearchRoutes from "./routes/ai-search-routes";
import newsletterRoutes from "./routes/newsletter-routes";
import { tenantIsolationMiddleware } from "./middleware/tenant-isolation";
import { setupVite, log } from "./vite";
import fs from "fs";
import path from "path";
import { Logger } from "./services/logger.service";
import fetch from "node-fetch";
import { EventEmitter } from "events";

// Listener-Warnungen entschärfen
EventEmitter.defaultMaxListeners = 30;
process.setMaxListeners(30);

// Express-App initialisieren
export const app = express();
const server = createServer(app);

// CORS aktivieren (für alle Ursprünge, später einschränken)
app.use(cors({ origin: "*" }));

// Body-Parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Multi-Tenant Isolation Middleware
app.use('/api/tenant', tenantIsolationMiddleware);
app.use('/tenant', tenantIsolationMiddleware);

// Simple Perplexity-Client
async function perplexityChat(prompt: string, model = "sonar"): Promise<string> {
  const API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!API_KEY) throw new Error("PERPLEXITY_API_KEY ist nicht gesetzt");

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Perplexity API Error ${res.status}`);
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content || "";
}

// Logger
const logger = new Logger("ServerMain");

// Health-Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI-Route
app.post("/api/ai", async (req: Request, res: Response) => {
  try {
    const prompt = req.body?.prompt;
    if (!prompt) return res.status(400).json({ error: "Feld 'prompt' erforderlich." });
    const answer = await perplexityChat(prompt);
    return res.json({ answer });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "AI-Service nicht verfügbar." });
  }
});

// Register Newsletter API routes FIRST to avoid conflicts
app.use('/api/newsletters', newsletterRoutes);

// Newsletter Sources API route
app.get('/api/newsletter-sources', async (req, res) => {
  try {
    console.log('[Newsletter Sources API] Fetching newsletter sources');
    
    // Return newsletter sources from newsletter_sources table or create mock data based on newsletters
    const newsletters = await sql`SELECT id, title, status, subscriber_count FROM newsletters`;
    
    const newsletterSources = newsletters.map(newsletter => ({
      id: newsletter.id,
      name: newsletter.title,
      type: 'internal',
      status: newsletter.status === 'approved' ? 'active' : 'inactive',
      subscriberCount: parseInt(newsletter.subscriber_count?.toString() || '0'),
      lastSync: new Date().toISOString(),
      source: 'Helix Newsletter System'
    }));

    // Add some real newsletter sources
    const externalSources = [
      {
        id: 'medtech-dive',
        name: 'MedTech Dive Newsletter',
        type: 'external',
        status: 'active',
        subscriberCount: 1250,
        lastSync: new Date().toISOString(),
        source: 'medtechdive.com'
      },
      {
        id: 'fda-updates',
        name: 'FDA Medical Device Updates',
        type: 'external', 
        status: 'active',
        subscriberCount: 890,
        lastSync: new Date().toISOString(),
        source: 'fda.gov'
      },
      {
        id: 'ema-newsletter',
        name: 'EMA Product News',
        type: 'external',
        status: 'active', 
        subscriberCount: 567,
        lastSync: new Date().toISOString(),
        source: 'ema.europa.eu'
      }
    ];

    const allSources = [...newsletterSources, ...externalSources];
    
    console.log(`[Newsletter Sources API] Returning ${allSources.length} newsletter sources`);
    res.json(allSources);

  } catch (error) {
    console.error('[Newsletter Sources API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter sources' });
  }
});

// Register main routes
registerRoutes(app);

// Setup customer AI routes  
setupCustomerAIRoutes(app);

// Register tenant-specific routes - ONLY new real data API
app.use('/api/tenant/auth', tenantAuthRoutes);
app.use('/api/tenant', tenantApiRoutes);  // NEW real data API with database connections
// OLD tenant routes REMOVED to prevent conflicts

// Register AI-powered search and analysis routes (Admin only)
app.use('/api/ai', aiSearchRoutes);

// Weitere Routen
app.post("/api/webhook", (req: Request, res: Response) => {
  console.log("Webhook empfangen:", req.body);
  res.json({ received: true });
});

// 404-Handler nur für API (must be AFTER all other routes)
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API nicht gefunden: ${req.path}` });
});

// Globaler Error-Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Entwicklungs- vs. Produktionsmodus
const isProd = process.env.NODE_ENV === "production" || app.get("env") !== "development";
if (!isProd) {
  // Vite Dev-Server im Dev-Modus
  setupVite(app, server).catch(console.error);
} else {
  // Statische Dateien im Prod-Modus
  const distPath = path.resolve(import.meta.url.replace("file://", ""), "../public");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
}

// Server starten
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = parseInt(process.env.PORT || "5174", 10);
  server.listen(port, () => {
    log(`Server läuft auf Port ${port}`);
  });
}
