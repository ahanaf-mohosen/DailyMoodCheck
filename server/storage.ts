import { users, journalEntries, quotes, savedQuotes, type User, type InsertUser, type JournalEntry, type InsertJournalEntry, type Quote, type InsertQuote, type SavedQuote, type InsertSavedQuote } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Journal entry methods
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  getJournalEntriesInDateRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Quote methods
  getQuotesByMood(mood: string): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  // Saved quotes methods
  saveQuote(userId: string, quoteId: string): Promise<SavedQuote>;
  unsaveQuote(userId: string, quoteId: string): Promise<void>;
  getSavedQuotes(userId: string): Promise<(SavedQuote & { quote: Quote })[]>;
  isQuoteSaved(userId: string, quoteId: string): Promise<boolean>;
  
  // Stats methods
  getUserStats(userId: string): Promise<{
    weeklyEntries: number;
    currentStreak: number;
    commonMood: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private journalEntries: Map<string, JournalEntry>;
  private quotes: Map<string, Quote>;

  constructor() {
    this.users = new Map();
    this.journalEntries = new Map();
    this.quotes = new Map();
    
    // Initialize with some sample quotes
    this.initializeQuotes();
  }

  private initializeQuotes() {
    const sampleQuotes = [
      { text: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Anonymous", moodTag: "happy" },
      { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", moodTag: "happy" },
      { text: "It's okay to feel sad sometimes. Your feelings are valid and this too shall pass.", author: "Anonymous", moodTag: "sad" },
      { text: "You are stronger than you think. Even in your darkest moments, remember that you have overcome challenges before.", author: "Anonymous", moodTag: "sad" },
      { text: "Anxiety is temporary. Take one moment at a time and breathe through it.", author: "Anonymous", moodTag: "anxious" },
      { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman", moodTag: "anxious" },
      { text: "You matter. Your life has value. There are people who care about you, even when it doesn't feel that way.", author: "Anonymous", moodTag: "suicidal" },
      { text: "This feeling is temporary. Please reach out for help. You are not alone in this.", author: "Anonymous", moodTag: "suicidal" },
      { text: "Sometimes the most productive thing you can do is to simply exist and be present.", author: "Anonymous", moodTag: "neutral" },
      { text: "Not every day needs to be extraordinary. There's beauty in ordinary moments too.", author: "Anonymous", moodTag: "neutral" },
    ];

    sampleQuotes.forEach(quote => {
      const id = randomUUID();
      this.quotes.set(id, { ...quote, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      photoUrl: insertUser.photoUrl || null,
      trustedEmail: insertUser.trustedEmail || null,
      trustedPhone: insertUser.trustedPhone || null,
      isVerified: false,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getJournalEntriesInDateRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => 
        entry.userId === userId &&
        entry.createdAt! >= startDate &&
        entry.createdAt! <= endDate
      )
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      createdAt: new Date(),
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async getQuotesByMood(mood: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(quote => quote.moodTag === mood);
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = { ...insertQuote, id };
    this.quotes.set(id, quote);
    return quote;
  }

  async saveQuote(userId: string, quoteId: string): Promise<SavedQuote> {
    // For MemStorage, we'll just return a mock saved quote
    const savedQuote: SavedQuote = {
      id: randomUUID(),
      userId,
      quoteId,
      savedAt: new Date(),
    };
    return savedQuote;
  }

  async unsaveQuote(userId: string, quoteId: string): Promise<void> {
    // For MemStorage, this is a no-op
    return;
  }

  async getSavedQuotes(userId: string): Promise<(SavedQuote & { quote: Quote })[]> {
    // For MemStorage, return empty array
    return [];
  }

  async isQuoteSaved(userId: string, quoteId: string): Promise<boolean> {
    // For MemStorage, always return false
    return false;
  }

  async getUserStats(userId: string): Promise<{
    weeklyEntries: number;
    currentStreak: number;
    commonMood: string;
  }> {
    const entries = await this.getJournalEntries(userId);
    
    // Calculate weekly entries (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyEntries = entries.filter(entry => entry.createdAt! > weekAgo).length;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasEntryToday = entries.some(entry => 
        entry.createdAt! >= dayStart && entry.createdAt! <= dayEnd
      );
      
      if (hasEntryToday) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate most common mood (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const recentEntries = entries.filter(entry => entry.createdAt! > monthAgo);
    
    const moodCounts: Record<string, number> = {};
    recentEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const commonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    );
    
    return {
      weeklyEntries,
      currentStreak,
      commonMood,
    };
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        trustedEmail: insertUser.trustedEmail || null,
        trustedPhone: insertUser.trustedPhone || null,
        isVerified: false,
        verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getJournalEntriesInDateRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, userId),
          gte(journalEntries.createdAt, startDate),
          lte(journalEntries.createdAt, endDate)
        )
      )
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const [entry] = await db
      .insert(journalEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async getQuotesByMood(mood: string): Promise<Quote[]> {
    return await db
      .select()
      .from(quotes)
      .where(eq(quotes.moodTag, mood));
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  async saveQuote(userId: string, quoteId: string): Promise<SavedQuote> {
    const [savedQuote] = await db
      .insert(savedQuotes)
      .values({ userId, quoteId })
      .returning();
    return savedQuote;
  }

  async unsaveQuote(userId: string, quoteId: string): Promise<void> {
    await db
      .delete(savedQuotes)
      .where(and(eq(savedQuotes.userId, userId), eq(savedQuotes.quoteId, quoteId)));
  }

  async getSavedQuotes(userId: string): Promise<(SavedQuote & { quote: Quote })[]> {
    const result = await db
      .select({
        id: savedQuotes.id,
        userId: savedQuotes.userId,
        quoteId: savedQuotes.quoteId,
        savedAt: savedQuotes.savedAt,
        quote: quotes,
      })
      .from(savedQuotes)
      .innerJoin(quotes, eq(savedQuotes.quoteId, quotes.id))
      .where(eq(savedQuotes.userId, userId))
      .orderBy(desc(savedQuotes.savedAt));
    
    return result;
  }

  async isQuoteSaved(userId: string, quoteId: string): Promise<boolean> {
    const [savedQuote] = await db
      .select()
      .from(savedQuotes)
      .where(and(eq(savedQuotes.userId, userId), eq(savedQuotes.quoteId, quoteId)))
      .limit(1);
    
    return !!savedQuote;
  }

  async getUserStats(userId: string): Promise<{
    weeklyEntries: number;
    currentStreak: number;
    commonMood: string;
  }> {
    const entries = await this.getJournalEntries(userId);
    
    // Calculate weekly entries (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyEntries = entries.filter(entry => entry.createdAt! > weekAgo).length;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasEntryToday = entries.some(entry => 
        entry.createdAt! >= dayStart && entry.createdAt! <= dayEnd
      );
      
      if (hasEntryToday) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate most common mood (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const recentEntries = entries.filter(entry => entry.createdAt! > monthAgo);
    
    const moodCounts: Record<string, number> = {};
    recentEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const commonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    );
    
    return {
      weeklyEntries,
      currentStreak,
      commonMood,
    };
  }
}

// Initialize sample quotes in database
async function initializeQuotes() {
  try {
    // Check if quotes already exist
    const existingQuotes = await db.select().from(quotes).limit(1);
    if (existingQuotes.length > 0) {
      return; // Quotes already initialized
    }

    const sampleQuotes = [
      { text: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Anonymous", moodTag: "happy" },
      { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", moodTag: "happy" },
      { text: "It's okay to feel sad sometimes. Your feelings are valid and this too shall pass.", author: "Anonymous", moodTag: "sad" },
      { text: "You are stronger than you think. Even in your darkest moments, remember that you have overcome challenges before.", author: "Anonymous", moodTag: "sad" },
      { text: "Anxiety is temporary. Take one moment at a time and breathe through it.", author: "Anonymous", moodTag: "anxious" },
      { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman", moodTag: "anxious" },
      { text: "You matter. Your life has value. There are people who care about you, even when it doesn't feel that way.", author: "Anonymous", moodTag: "suicidal" },
      { text: "This feeling is temporary. Please reach out for help. You are not alone in this.", author: "Anonymous", moodTag: "suicidal" },
      { text: "Sometimes the most productive thing you can do is to simply exist and be present.", author: "Anonymous", moodTag: "neutral" },
      { text: "Not every day needs to be extraordinary. There's beauty in ordinary moments too.", author: "Anonymous", moodTag: "neutral" },
    ];

    for (const quote of sampleQuotes) {
      await db.insert(quotes).values(quote);
    }
    
    console.log("Sample quotes initialized in database");
  } catch (error) {
    console.error("Error initializing quotes:", error);
  }
}

// Initialize quotes when the module is loaded
initializeQuotes();

export const storage = new DatabaseStorage();
