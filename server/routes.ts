import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScriptSchema, insertIdeaSchema, insertThumbnailSchema } from "@shared/schema";
import { z } from "zod";
import { moderateObject } from "./moderation";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Health check endpoint for monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
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
      const script = await storage.getScript(parseInt(req.params.id));
      if (!script) { res.status(404).json({ error: "Script not found" }); return; }
      res.json(script);
    } catch { res.status(500).json({ error: "Failed to fetch script" }); }
  });
  app.patch("/api/scripts/:id", async (req, res) => {
    try {
      const moderation = moderateObject(req.body);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      const updated = await storage.updateScript(parseInt(req.params.id), req.body);
      if (!updated) { res.status(404).json({ error: "Script not found" }); return; }
      res.json(updated);
    } catch { res.status(500).json({ error: "Failed to update script" }); }
  });
  app.delete("/api/scripts/:id", async (req, res) => {
    try {
      const success = await storage.deleteScript(parseInt(req.params.id));
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
      const moderation = moderateObject(req.body);
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      const updated = await storage.updateIdea(parseInt(req.params.id), req.body);
      if (!updated) { res.status(404).json({ error: "Idea not found" }); return; }
      res.json(updated);
    } catch { res.status(500).json({ error: "Failed to update idea" }); }
  });
  app.delete("/api/ideas/:id", async (req, res) => {
    try {
      const success = await storage.deleteIdea(parseInt(req.params.id));
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
      const thumbnail = await storage.getThumbnail(parseInt(req.params.id));
      if (!thumbnail) { res.status(404).json({ error: "Thumbnail not found" }); return; }
      res.json(thumbnail);
    } catch { res.status(500).json({ error: "Failed to fetch thumbnail" }); }
  });
  app.delete("/api/thumbnails/:id", async (req, res) => {
    try {
      const success = await storage.deleteThumbnail(parseInt(req.params.id));
      if (!success) { res.status(404).json({ error: "Thumbnail not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete thumbnail" }); }
  });
  return httpServer;
}
