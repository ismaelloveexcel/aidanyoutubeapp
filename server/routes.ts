import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { insertScriptSchema, insertIdeaSchema, insertThumbnailSchema, insertRecordingSchema, insertVideoProjectSchema } from "@shared/schema";
import { z } from "zod";
import { moderateObject } from "./moderation";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { isAIEnabled, generateDescription, generateTags, generateThumbnailIdeas, generateContentIdeas } from "./ai";
import { isYouTubeAuthConfigured, getYouTubeAuthUrl, exchangeCodeForTokens, getChannelInfo } from "./youtube-auth";

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

  // Recording routes
  app.post("/api/recordings", async (req, res) => {
    try {
      const recording = insertRecordingSchema.parse(req.body);
      const moderation = moderateObject({ title: recording.title });
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      res.json(await storage.createRecording(recording));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to create recording" });
    }
  });
  app.get("/api/recordings", async (req, res) => {
    try { res.json(await storage.getAllRecordings()); } catch { res.status(500).json({ error: "Failed to fetch recordings" }); }
  });
  app.get("/api/recordings/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid recording id" }); return; }
      const recording = await storage.getRecording(id);
      if (!recording) { res.status(404).json({ error: "Recording not found" }); return; }
      res.json(recording);
    } catch { res.status(500).json({ error: "Failed to fetch recording" }); }
  });
  app.patch("/api/recordings/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid recording id" }); return; }
      const updates = insertRecordingSchema.partial().parse(req.body);
      if (updates.title) {
        const moderation = moderateObject({ title: updates.title });
        if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      }
      const updated = await storage.updateRecording(id, updates);
      if (!updated) { res.status(404).json({ error: "Recording not found" }); return; }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to update recording" });
    }
  });
  app.delete("/api/recordings/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid recording id" }); return; }
      const success = await storage.deleteRecording(id);
      if (!success) { res.status(404).json({ error: "Recording not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete recording" }); }
  });

  // Video Project routes
  app.post("/api/video-projects", async (req, res) => {
    try {
      const project = insertVideoProjectSchema.parse(req.body);
      const moderation = moderateObject({ title: project.title });
      if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      res.json(await storage.createVideoProject(project));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to create video project" });
    }
  });
  app.get("/api/video-projects", async (req, res) => {
    try { res.json(await storage.getAllVideoProjects()); } catch { res.status(500).json({ error: "Failed to fetch video projects" }); }
  });
  app.get("/api/video-projects/stats", async (req, res) => {
    try { res.json(await storage.getVideoProjectStats()); } catch { res.status(500).json({ error: "Failed to fetch video project stats" }); }
  });
  app.get("/api/video-projects/recent", async (req, res) => {
    try { res.json(await storage.getRecentVideoProjects(5)); } catch { res.status(500).json({ error: "Failed to fetch recent video projects" }); }
  });
  app.get("/api/video-projects/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid project id" }); return; }
      const project = await storage.getVideoProject(id);
      if (!project) { res.status(404).json({ error: "Video project not found" }); return; }
      res.json(project);
    } catch { res.status(500).json({ error: "Failed to fetch video project" }); }
  });
  app.patch("/api/video-projects/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid project id" }); return; }
      const updates = insertVideoProjectSchema.partial().parse(req.body);
      if (updates.title) {
        const moderation = moderateObject({ title: updates.title });
        if (!moderation.isClean) { res.status(400).json({ error: moderation.errorMessage, moderated: true }); return; }
      }
      const updated = await storage.updateVideoProject(id, updates);
      if (!updated) { res.status(404).json({ error: "Video project not found" }); return; }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: error.errors });
      else res.status(500).json({ error: "Failed to update video project" });
    }
  });
  app.delete("/api/video-projects/:id", async (req, res) => {
    try {
      const id = parseIdParam(req.params.id);
      if (id === null) { res.status(400).json({ error: "Invalid project id" }); return; }
      const success = await storage.deleteVideoProject(id);
      if (!success) { res.status(404).json({ error: "Video project not found" }); return; }
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete video project" }); }
  });

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // AI Assistant routes (Google Gemini - Free Tier)
  app.get("/api/ai/status", (req, res) => {
    res.json({ 
      enabled: isAIEnabled(),
      provider: isAIEnabled() ? "Google Gemini" : "Fallback Templates",
      message: isAIEnabled() 
        ? "AI is powered by Google Gemini (free tier)" 
        : "Set GEMINI_API_KEY for real AI. Currently using smart templates."
    });
  });

  app.post("/api/ai/description", async (req, res) => {
    try {
      const { videoTitle } = req.body;
      if (!videoTitle || typeof videoTitle !== 'string') {
        res.status(400).json({ error: "Video title is required" });
        return;
      }
      const description = await generateDescription(videoTitle);
      res.json({ description, aiPowered: isAIEnabled() });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate description" });
    }
  });

  app.post("/api/ai/tags", async (req, res) => {
    try {
      const { videoTitle } = req.body;
      if (!videoTitle || typeof videoTitle !== 'string') {
        res.status(400).json({ error: "Video title is required" });
        return;
      }
      const tags = await generateTags(videoTitle);
      res.json({ tags, aiPowered: isAIEnabled() });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate tags" });
    }
  });

  app.post("/api/ai/thumbnail-ideas", async (req, res) => {
    try {
      const { videoTitle } = req.body;
      if (!videoTitle || typeof videoTitle !== 'string') {
        res.status(400).json({ error: "Video title is required" });
        return;
      }
      const ideas = await generateThumbnailIdeas(videoTitle);
      res.json({ ideas, aiPowered: isAIEnabled() });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate thumbnail ideas" });
    }
  });

  app.post("/api/ai/content-ideas", async (req, res) => {
    try {
      const { category } = req.body;
      // Validate category is a string if provided
      const validCategory = typeof category === 'string' ? category : undefined;
      const ideas = await generateContentIdeas(validCategory);
      res.json({ ideas, aiPowered: isAIEnabled() });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate content ideas" });
    }
  });

  // YouTube OAuth routes
  app.get("/api/auth/youtube/status", (req, res) => {
    res.json({
      configured: isYouTubeAuthConfigured(),
      message: isYouTubeAuthConfigured()
        ? "YouTube OAuth is configured. You can connect your account."
        : "YouTube OAuth is not configured. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET environment variables.",
    });
  });

  app.get("/api/auth/youtube", (req, res) => {
    if (!isYouTubeAuthConfigured()) {
      res.status(503).json({
        error: "YouTube OAuth is not configured",
        message: "Please ask your parent or guardian to configure YouTube API credentials.",
      });
      return;
    }

    const authUrl = getYouTubeAuthUrl();
    if (!authUrl) {
      res.status(500).json({ error: "Failed to generate auth URL" });
      return;
    }

    res.json({ authUrl });
  });

  app.get("/api/auth/youtube/callback", async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      // User denied access or there was an error
      res.redirect("/?youtube_error=" + encodeURIComponent(String(error)));
      return;
    }

    if (!code || typeof code !== "string") {
      res.redirect("/?youtube_error=no_code");
      return;
    }

    try {
      const tokens = await exchangeCodeForTokens(code);
      if (!tokens) {
        res.redirect("/?youtube_error=token_exchange_failed");
        return;
      }

      // Get channel info to verify the connection works
      const channelInfo = await getChannelInfo(tokens.accessToken);
      
      // In a real app, you would store these tokens securely in the database
      // For this demo, we'll pass them back to the frontend via query params
      // (In production, use secure HTTP-only cookies or session storage)
      const params = new URLSearchParams({
        youtube_connected: "true",
        channel_name: channelInfo?.channelTitle || "YouTube Channel",
      });
      
      res.redirect("/youtube-upload?" + params.toString());
    } catch (error) {
      console.error("YouTube OAuth callback error:", error);
      res.redirect("/?youtube_error=callback_failed");
    }
  });

  app.post("/api/auth/youtube/channel-info", async (req, res) => {
    const { accessToken } = req.body;
    
    if (!accessToken || typeof accessToken !== "string") {
      res.status(400).json({ error: "Access token is required" });
      return;
    }

    try {
      const channelInfo = await getChannelInfo(accessToken);
      if (!channelInfo) {
        res.status(404).json({ error: "Channel not found" });
        return;
      }
      res.json(channelInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to get channel info" });
    }
  });

  return httpServer;
}
