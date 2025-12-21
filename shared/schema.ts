import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  templateId: text("template_id").notNull(),
  title: text("title").notNull(),
  steps: json("steps").$type<{ stepId: number; content: string }[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  saved: boolean("saved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const thumbnails = pgTable("thumbnails", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  bgColor: text("bg_color").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true,
});

export const insertThumbnailSchema = createInsertSchema(thumbnails).omit({
  id: true,
  createdAt: true,
});

// Video Projects for Editor
export const videoProjects = pgTable("video_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  clips: json("clips").$type<{ id: string; url: string; startTime: number; endTime: number; duration: number }[]>().notNull().default([]),
  textOverlays: json("text_overlays").$type<{ id: string; text: string; startTime: number; endTime: number; x: number; y: number; fontSize: number; color: string }[]>().notNull().default([]),
  transitions: json("transitions").$type<{ id: string; type: string; at: number }[]>().notNull().default([]),
  musicTrack: text("music_track"),
  duration: integer("duration").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVideoProjectSchema = createInsertSchema(videoProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Achievements & Badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  badgeName: text("badge_name").notNull(),
  badgeDescription: text("badge_description").notNull(),
  badgeEmoji: text("badge_emoji").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

// Content Calendar
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  type: text("type").notNull(), // "upload", "filming", "editing", "reminder"
  status: text("status").notNull().default("pending"), // "pending", "completed", "cancelled"
  videoId: integer("video_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
});

// Analytics Data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull(),
  videoTitle: text("video_title").notNull(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  watchTime: integer("watch_time").notNull().default(0), // in seconds
  date: timestamp("date").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

// Daily Challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  challengeType: text("challenge_type").notNull(),
  challengeTitle: text("challenge_title").notNull(),
  challengeDescription: text("challenge_description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  completed: boolean("completed").notNull().default(false),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scripts.$inferSelect;

export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Idea = typeof ideas.$inferSelect;

export type InsertThumbnail = z.infer<typeof insertThumbnailSchema>;
export type Thumbnail = typeof thumbnails.$inferSelect;

export type InsertVideoProject = z.infer<typeof insertVideoProjectSchema>;
export type VideoProject = typeof videoProjects.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
