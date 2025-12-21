import { users, scripts, ideas, thumbnails, type User, type InsertUser, type Script, type InsertScript, type Idea, type InsertIdea, type Thumbnail, type InsertThumbnail } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
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
}

export const storage = new DatabaseStorage();
