import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { insertScriptSchema, insertIdeaSchema, insertThumbnailSchema } from "@shared/schema";
import { z } from "zod";
import { moderateObject } from "./moderation";

const updateScriptSchema = insertScriptSchema.partial();
const updateIdeaSchema = insertIdeaSchema.partial();

function parseIdParam(idParam: string): number | null {
  const id = Number.parseInt(idParam, 10);
  return Number.isNaN(id) ? null : id;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Health check endpoint for monitoring
  // Includes database connectivity check for proper health verification
  app.get("/health", async (req, res) => {
    const healthStatus: {
      status: string;
      timestamp: string;
      uptime: number;
      database?: string;
      error?: string;
    } = { 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };

    // Check database connectivity
    let client;
    try {
      client = await pool.connect();
      await client.query('SELECT 1');
      healthStatus.database = "connected";
    } catch (dbError) {
      healthStatus.status = "degraded";
      healthStatus.database = "disconnected";
      healthStatus.error = dbError instanceof Error ? dbError.message : "Database connection failed";
      // Return 503 if database is not available
      res.status(503).json(healthStatus);
      return;
    } finally {
      if (client) {
        client.release();
      }
    }

    res.status(200).json(healthStatus);
  });

  // API routes
  app.post("/api/scripts", async (req, res) => {
    try {
      const script = insertScriptSchema.parse(req.body);
      const moderation = moderateObject(script);
      if (!moderation.isClean) {
        res.status(400).json({ error: moderation.errorMessage, moderated: true });
        return;
      }
      const newScript = await storage.createScript(script);
      res.json(newScript);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to create script" });
    }
  });
  app.get("/api/scripts", async (req, res) => {
    try { res.json(await storage.getAllScripts()); } catch { res.status(500).json({ error: "Failed to fetch scripts" }); }
  });
  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid script id" });
        return;
      }
      const script = await storage.getScript(id);
      if (!script) { res.status(404).json({ error: "Script not found" }); return; }
      res.json(script);
    } catch { res.status(500).json({ error: "Failed to fetch script" }); }
  });
  app.patch("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid script id" });
        return;
      }
      const updateData = updateScriptSchema.parse(req.body);
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No updates provided" });
        return;
      }
      const moderation = moderateObject(updateData);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      const updated = await storage.updateScript(id, updateData);
      if (!updated) { res.status(404).json({ error: "Script not found" }); return; }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to update script" });
    }
  });
  app.delete("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid script id" });
        return;
      }
      const success = await storage.deleteScript(id);
      if (!success) { res.status(404).json({ error: "Script not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete script" }); }
  });
  app.post("/api/ideas", async (req, res) => {
    try {
      const idea = insertIdeaSchema.parse(req.body);
      const moderation = moderateObject(idea);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      res.json(await storage.createIdea(idea));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to create idea" });
    }
  });
  app.get("/api/ideas", async (req, res) => {
    try {
      const savedOnly = req.query.saved === 'true';
      res.json(savedOnly ? await storage.getSavedIdeas() : await storage.getAllIdeas());
    } catch { res.status(500).json({ error: "Failed to fetch ideas" }); }
  });
  app.patch("/api/ideas/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid idea id" });
        return;
      }
      const updateData = updateIdeaSchema.parse(req.body);
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No updates provided" });
        return;
      }
      const moderation = moderateObject(updateData);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      const updated = await storage.updateIdea(id, updateData);
      if (!updated) { res.status(404).json({ error: "Idea not found" }); return; }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to update idea" });
    }
  });
  app.delete("/api/ideas/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid idea id" });
        return;
      }
      const success = await storage.deleteIdea(id);
      if (!success) { res.status(404).json({ error: "Idea not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete idea" }); }
  });
  app.post("/api/thumbnails", async (req, res) => {
    try {
      const thumbnail = insertThumbnailSchema.parse(req.body);
      const moderation = moderateObject(thumbnail);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      res.json(await storage.createThumbnail(thumbnail));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to create thumbnail" });
    }
  });
  app.get("/api/thumbnails", async (req, res) => {
    try { res.json(await storage.getAllThumbnails()); } catch { res.status(500).json({ error: "Failed to fetch thumbnails" }); }
  });
  app.get("/api/thumbnails/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid thumbnail id" });
        return;
      }
      const thumbnail = await storage.getThumbnail(id);
      if (!thumbnail) { res.status(404).json({ error: "Thumbnail not found" }); return; }
      res.json(thumbnail);
    } catch { res.status(500).json({ error: "Failed to fetch thumbnail" }); }
  });
  app.delete("/api/thumbnails/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid thumbnail id" });
        return;
      }
      const success = await storage.deleteThumbnail(id);
      if (!success) { res.status(404).json({ error: "Thumbnail not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete thumbnail" }); }
  });
  return httpServer;
}
