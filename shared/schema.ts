import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  trustedEmail: text("trusted_email"),
  trustedPhone: text("trusted_phone"),
  photoUrl: text("photo_url"),
  isVerified: boolean("is_verified").default(false),
  verificationCode: text("verification_code"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  entryText: text("entry_text").notNull(),
  mood: text("mood").notNull(), // 'happy', 'sad', 'anxious', 'suicidal', 'neutral'
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  author: text("author").notNull(),
  moodTag: text("mood_tag").notNull(), // corresponds to mood types
});

export const savedQuotes = pgTable("saved_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id),
  savedAt: timestamp("saved_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVerified: true,
  verificationCode: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
});

export const insertSavedQuoteSchema = createInsertSchema(savedQuotes).omit({
  id: true,
  savedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  trustedEmail: z.string().email().optional().or(z.literal("")),
  trustedPhone: z.string().optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertSavedQuote = z.infer<typeof insertSavedQuoteSchema>;
export type SavedQuote = typeof savedQuotes.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;
