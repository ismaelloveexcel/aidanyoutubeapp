import { users, scripts, ideas, thumbnails, recordings, videoProjects, type User, type InsertUser, type Script, type InsertScript, type Idea, type InsertIdea, type Thumbnail, type InsertThumbnail, type Recording, type InsertRecording, type VideoProject, type InsertVideoProject } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  createScript(script: InsertScript): Promise<Script>;
  updateScript(id: number, script: Partial<InsertScript>): Promise<Script | undefined>;
  getScript(id: number): Promise<Script | undefined>;
  getAllScripts(): Promise<Script[]>;
  deleteScript(id: number): Promise<boolean>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  getAllIdeas(): Promise<Idea[]>;
  getSavedIdeas(): Promise<Idea[]>;
  updateIdea(id: number, idea: Partial<InsertIdea>): Promise<Idea | undefined>;
  deleteIdea(id: number): Promise<boolean>;
  createThumbnail(thumbnail: InsertThumbnail): Promise<Thumbnail>;
  getAllThumbnails(): Promise<Thumbnail[]>;
  getThumbnail(id: number): Promise<Thumbnail | undefined>;
  deleteThumbnail(id: number): Promise<boolean>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  updateRecording(id: number, recording: Partial<InsertRecording>): Promise<Recording | undefined>;
  getRecording(id: number): Promise<Recording | undefined>;
  getAllRecordings(): Promise<Recording[]>;
  deleteRecording(id: number): Promise<boolean>;
  createVideoProject(project: InsertVideoProject): Promise<VideoProject>;
  updateVideoProject(id: number, project: Partial<InsertVideoProject>): Promise<VideoProject | undefined>;
  getVideoProject(id: number): Promise<VideoProject | undefined>;
  getAllVideoProjects(): Promise<VideoProject[]>;
  deleteVideoProject(id: number): Promise<boolean>;
  getVideoProjectStats(): Promise<{ total: number; draft: number; inProgress: number; published: number }>;
  getRecentVideoProjects(limit?: number): Promise<VideoProject[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return user;
  }
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async createScript(script: InsertScript): Promise<Script> {
    const [newScript] = await db.insert(scripts).values({ templateId: script.templateId, title: script.title, steps: script.steps as any }).returning();
    return newScript;
  }
  async updateScript(id: number, script: Partial<InsertScript>): Promise<Script | undefined> {
    const updateData: any = { ...script, updatedAt: new Date() };
    const [updated] = await db.update(scripts).set(updateData).where(eq(scripts.id, id)).returning();
    return updated || undefined;
  }
  async getScript(id: number): Promise<Script | undefined> {
    const [script] = await db.select().from(scripts).where(eq(scripts.id, id));
    return script || undefined;
  }
  async getAllScripts(): Promise<Script[]> {
    return await db.select().from(scripts).orderBy(desc(scripts.updatedAt));
  }
  async deleteScript(id: number): Promise<boolean> {
    const result = await db.delete(scripts).where(eq(scripts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async createIdea(idea: InsertIdea): Promise<Idea> {
    const [newIdea] = await db.insert(ideas).values(idea).returning();
    return newIdea;
  }
  async getAllIdeas(): Promise<Idea[]> {
    return await db.select().from(ideas).orderBy(desc(ideas.createdAt));
  }
  async getSavedIdeas(): Promise<Idea[]> {
    return await db.select().from(ideas).where(eq(ideas.saved, true)).orderBy(desc(ideas.createdAt));
  }
  async updateIdea(id: number, idea: Partial<InsertIdea>): Promise<Idea | undefined> {
    const [updated] = await db.update(ideas).set(idea).where(eq(ideas.id, id)).returning();
    return updated || undefined;
  }
  async deleteIdea(id: number): Promise<boolean> {
    const result = await db.delete(ideas).where(eq(ideas.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async createThumbnail(thumbnail: InsertThumbnail): Promise<Thumbnail> {
    const [newThumbnail] = await db.insert(thumbnails).values(thumbnail).returning();
    return newThumbnail;
  }
  async getAllThumbnails(): Promise<Thumbnail[]> {
    return await db.select().from(thumbnails).orderBy(desc(thumbnails.createdAt));
  }
  async getThumbnail(id: number): Promise<Thumbnail | undefined> {
    const [thumbnail] = await db.select().from(thumbnails).where(eq(thumbnails.id, id));
    return thumbnail || undefined;
  }
  async deleteThumbnail(id: number): Promise<boolean> {
    const result = await db.delete(thumbnails).where(eq(thumbnails.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async createRecording(recording: InsertRecording): Promise<Recording> {
    const [newRecording] = await db.insert(recordings).values(recording).returning();
    return newRecording;
  }
  async updateRecording(id: number, recording: Partial<InsertRecording>): Promise<Recording | undefined> {
    const updateData: any = { ...recording, updatedAt: new Date() };
    const [updated] = await db.update(recordings).set(updateData).where(eq(recordings.id, id)).returning();
    return updated || undefined;
  }
  async getRecording(id: number): Promise<Recording | undefined> {
    const [recording] = await db.select().from(recordings).where(eq(recordings.id, id));
    return recording || undefined;
  }
  async getAllRecordings(): Promise<Recording[]> {
    return await db.select().from(recordings).orderBy(desc(recordings.updatedAt));
  }
  async deleteRecording(id: number): Promise<boolean> {
    const result = await db.delete(recordings).where(eq(recordings.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async createVideoProject(project: InsertVideoProject): Promise<VideoProject> {
    const [newProject] = await db.insert(videoProjects).values(project as any).returning();
    return newProject;
  }
  async updateVideoProject(id: number, project: Partial<InsertVideoProject>): Promise<VideoProject | undefined> {
    const updateData: any = { ...project, updatedAt: new Date() };
    const [updated] = await db.update(videoProjects).set(updateData).where(eq(videoProjects.id, id)).returning();
    return updated || undefined;
  }
  async getVideoProject(id: number): Promise<VideoProject | undefined> {
    const [project] = await db.select().from(videoProjects).where(eq(videoProjects.id, id));
    return project || undefined;
  }
  async getAllVideoProjects(): Promise<VideoProject[]> {
    return await db.select().from(videoProjects).orderBy(desc(videoProjects.updatedAt));
  }
  async deleteVideoProject(id: number): Promise<boolean> {
    const result = await db.delete(videoProjects).where(eq(videoProjects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  async getVideoProjectStats(): Promise<{ total: number; draft: number; inProgress: number; published: number }> {
    const projects = await db.select().from(videoProjects);
    const draft = projects.filter(p => p.status === "draft").length;
    const inProgress = projects.filter(p => p.status === "in_progress").length;
    const published = projects.filter(p => p.status === "published").length;
    return { total: projects.length, draft, inProgress, published };
  }
  async getRecentVideoProjects(limit: number = 5): Promise<VideoProject[]> {
    return await db.select().from(videoProjects).orderBy(desc(videoProjects.updatedAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
