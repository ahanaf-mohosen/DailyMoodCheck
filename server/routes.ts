import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { signupSchema, loginSchema, insertJournalEntrySchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { analyzeMoodAdvanced, analyzeMoodSimple } from "./services/moodAnalysis";

const JWT_SECRET = process.env.JWT_SECRET || "daily-journal-secret-key";
const EMAIL_USER = process.env.EMAIL_USER || "noreply@dailyjournal.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "email-password";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Generate insights from mood patterns
function generatePatternInsights(moodCounts: Record<string, number>, trend: string, riskDaysCount: number): string[] {
  const insights: string[] = [];
  const totalEntries = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
  
  if (totalEntries === 0) {
    return ["Start journaling to track your mood patterns!"];
  }
  
  // Most common mood
  const dominantMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const dominantPercentage = Math.round((moodCounts[dominantMood] / totalEntries) * 100);
  
  insights.push(`Your most common mood is ${dominantMood} (${dominantPercentage}% of entries)`);
  
  // Trend insights
  if (trend === 'improving') {
    insights.push("✨ Your mood trend is improving over the past week!");
  } else if (trend === 'declining') {
    insights.push("⚠️ Your mood seems to be declining lately. Consider reaching out for support.");
  } else {
    insights.push("Your mood has been relatively stable recently.");
  }
  
  // Risk insights
  if (riskDaysCount > 0) {
    insights.push(`🚨 You've had ${riskDaysCount} concerning entries recently. Please consider professional support.`);
  }
  
  // Positive insights
  const positiveCount = (moodCounts.happy || 0) + (moodCounts.content || 0);
  if (positiveCount > totalEntries * 0.3) {
    insights.push("🌟 You have many positive entries - great job maintaining good mental health!");
  }
  
  // Diversity insights
  const moodVariety = Object.keys(moodCounts).length;
  if (moodVariety >= 4) {
    insights.push("You experience a healthy range of emotions in your journaling.");
  }
  
  return insights;
}

// Mood analysis function (kept for backward compatibility)
function analyzeMood(text: string): string {
  return analyzeMoodSimple(text);
}

// Send emergency email
async function sendEmergencyEmail(user: any, journalText: string) {
  // Only send if trusted email is provided
  if (!user.trustedEmail) {
    console.log(`No trusted email configured for user ${user.name}, skipping emergency email`);
    return;
  }

  const profileImageHtml = user.photoUrl ? 
    `<img src="${user.photoUrl}" alt="${user.name}'s profile" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 15px;">` : 
    `<div style="width: 60px; height: 60px; border-radius: 50%; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 24px; color: #6b7280;">${user.name.charAt(0).toUpperCase()}</div>`;

  const mailOptions = {
    from: EMAIL_USER,
    to: user.trustedEmail,
    subject: `URGENT: ${user.name} may need support - Daily Journal Alert`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Emergency Alert - Daily Journal</h2>
        <p>This is an automated emergency alert from Daily Journal.</p>
        
        <div style="display: flex; align-items: center; background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
          ${profileImageHtml}
          <div>
            <h3 style="margin: 0; color: #111827;">${user.name}</h3>
            <p style="margin: 5px 0 0 0; color: #6b7280;">${user.email}</p>
          </div>
        </div>
        
        <p><strong>${user.name}</strong> has written a journal entry that may indicate they are experiencing suicidal thoughts.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Journal Entry Content:</h3>
          <p style="font-style: italic;">"${journalText.substring(0, 500)}${journalText.length > 500 ? '...' : ''}"</p>
          <p><small>Entry date: ${new Date().toLocaleString()}</small></p>
        </div>
        
        <p><strong>Please reach out to ${user.name} as soon as possible.</strong></p>
        <p>If you believe this is an immediate emergency, please contact local emergency services.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4>Crisis Resources:</h4>
          <ul>
            <li>National Suicide Prevention Lifeline: 988</li>
            <li>Crisis Text Line: Text HOME to 741741</li>
            <li>Emergency Services: 911</li>
          </ul>
        </div>
        
        <p><small>This message was sent automatically by Daily Journal's emergency alert system.</small></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Emergency email sent to ${user.trustedEmail} for user ${user.name}`);
  } catch (error) {
    console.error('Failed to send emergency email:', error);
    // Continue without failing the journal entry save
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Add session middleware for OAuth
  app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        
        if (user) {
          // Update user info from Google profile
          user = await storage.updateUser(user.id, {
            name: profile.displayName || user.name,
            photoUrl: profile.photos?.[0]?.value || user.photoUrl,
          });
        } else {
          // Create new user
          user = await storage.createUser({
            name: profile.displayName || 'Google User',
            email: profile.emails?.[0]?.value || '',
            password: '', // No password for OAuth users
            trustedEmail: '', // Will need to be set later
            trustedPhone: '', // Will need to be set later
            photoUrl: profile.photos?.[0]?.value || null,
          });
          // Auto-verify OAuth users
          const updatedUser = await storage.updateUser(user.id, { isVerified: true });
          user = updatedUser || user;
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }));
  }

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        trustedEmail: validatedData.trustedEmail,
        trustedPhone: validatedData.trustedPhone,
        photoUrl: validatedData.photoUrl,
      });
      
      // Send verification email (only if email credentials are configured)
      let emailSent = false;
      if (EMAIL_USER && EMAIL_PASS && EMAIL_USER !== "noreply@dailyjournal.com") {
        try {
          const mailOptions = {
            from: EMAIL_USER,
            to: user.email,
            subject: "Verify your Daily Journal account",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Daily Journal!</h2>
                <p>Hi ${user.name},</p>
                <p>Your verification code is: <strong style="font-size: 24px; color: #3b82f6;">${user.verificationCode}</strong></p>
                <p>Please enter this code to verify your account and start journaling.</p>
                <p>If you didn't create this account, please ignore this email.</p>
              </div>
            `,
          };
          
          await transporter.sendMail(mailOptions);
          emailSent = true;
        } catch (error) {
          console.error('Email sending failed, but continuing registration:', error);
        }
      }
      
      // In development, auto-verify users if email can't be sent
      if (!emailSent && process.env.NODE_ENV === 'development') {
        await storage.updateUser(user.id, { isVerified: true });
        console.log(`Auto-verified user ${user.name} in development mode`);
      }
      
      res.status(201).json({ 
        message: emailSent ? 
          "User created successfully. Please check your email for verification code." : 
          "User created and verified successfully. You can now log in.",
        userId: user.id,
        autoVerified: !emailSent && process.env.NODE_ENV === 'development'
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { userId, code } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.verificationCode !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      
      await storage.updateUser(userId, { 
        isVerified: true, 
        verificationCode: null 
      });
      
      res.json({ message: "Account verified successfully" });
    } catch (error: any) {
      console.error("Verification error:", error);
      res.status(400).json({ message: error.message || "Verification failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your account first" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          photoUrl: user.photoUrl,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req: any, res) => {
      try {
        const user = req.user;
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        // Redirect to frontend with token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
      } catch (error) {
        console.error("Google callback error:", error);
        res.redirect("/login?error=auth_failed");
      }
    }
  );

  // Protected routes
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        trustedEmail: user.trustedEmail,
        trustedPhone: user.trustedPhone,
        photoUrl: user.photoUrl,
      });
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      // Hash password if provided
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        trustedEmail: updatedUser.trustedEmail,
        trustedPhone: updatedUser.trustedPhone,
        photoUrl: updatedUser.photoUrl,
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Journal routes
  app.get("/api/journal/entries", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error: any) {
      console.error("Fetch entries error:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal/analyze", authenticateToken, async (req: any, res) => {
    try {
      const { entryText } = req.body;
      
      if (!entryText || typeof entryText !== 'string') {
        return res.status(400).json({ message: "Entry text is required" });
      }
      
      const mood = analyzeMood(entryText);
      const quotes = await storage.getQuotesByMood(mood);
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      
      res.json({
        mood,
        quote: randomQuote,
      });
    } catch (error: any) {
      console.error("Mood analysis error:", error);
      res.status(500).json({ message: "Failed to analyze mood" });
    }
  });

  // Advanced mood analysis endpoint
  app.post("/api/journal/analyze-advanced", authenticateToken, async (req: any, res) => {
    try {
      const { entryText } = req.body;
      
      if (!entryText || typeof entryText !== 'string') {
        return res.status(400).json({ message: "Entry text is required" });
      }
      
      // Perform advanced mood analysis
      const analysisResult = await analyzeMoodAdvanced(entryText);
      
      // Get quotes for the primary mood
      const quotes = await storage.getQuotesByMood(analysisResult.primaryMood);
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      
      res.json({
        ...analysisResult,
        quote: randomQuote,
      });
    } catch (error: any) {
      console.error("Advanced mood analysis error:", error);
      res.status(500).json({ message: "Failed to perform advanced mood analysis" });
    }
  });

  // Mood pattern analysis endpoint
  app.get("/api/journal/mood-patterns", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;
      
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - parseInt(days as string));
      
      const entries = await storage.getJournalEntriesInDateRange(userId, dateFrom, new Date());
      
      // Analyze mood patterns
      const moodCounts: Record<string, number> = {};
      const dailyMoods: Record<string, string[]> = {};
      const riskDays: Array<{ date: string; riskLevel: string; entry: string }> = [];
      
      for (const entry of entries) {
        const date = entry.createdAt!.toISOString().split('T')[0];
        
        // Count primary moods
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        
        // Track daily moods
        if (!dailyMoods[date]) dailyMoods[date] = [];
        dailyMoods[date].push(entry.mood);
        
        // Analyze each entry for risk
        try {
          const analysis = await analyzeMoodAdvanced(entry.entryText);
          if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
            riskDays.push({
              date,
              riskLevel: analysis.riskLevel,
              entry: entry.entryText.substring(0, 100) + '...'
            });
          }
        } catch (error) {
          console.error('Error analyzing entry for patterns:', error);
        }
      }
      
      // Calculate trends
      const sortedDates = Object.keys(dailyMoods).sort();
      const recentMoods = sortedDates.slice(-7).flatMap(date => dailyMoods[date]);
      const earlierMoods = sortedDates.slice(-14, -7).flatMap(date => dailyMoods[date]);
      
      // Simple trend calculation
      const recentNegative = recentMoods.filter(mood => ['sad', 'anxious', 'severely_depressed', 'suicidal'].includes(mood)).length;
      const earlierNegative = earlierMoods.filter(mood => ['sad', 'anxious', 'severely_depressed', 'suicidal'].includes(mood)).length;
      
      let trend = 'stable';
      if (recentNegative > earlierNegative + 1) trend = 'declining';
      else if (recentNegative < earlierNegative - 1) trend = 'improving';
      
      res.json({
        moodDistribution: moodCounts,
        trend,
        riskDays: riskDays.slice(-10), // Last 10 risk days
        totalEntries: entries.length,
        averageEntriesPerDay: entries.length / parseInt(days as string),
        insights: generatePatternInsights(moodCounts, trend, riskDays.length)
      });
    } catch (error: any) {
      console.error("Mood pattern analysis error:", error);
      res.status(500).json({ message: "Failed to analyze mood patterns" });
    }
  });

  app.post("/api/journal/save", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { entryText, mood } = req.body;
      
      if (!entryText || !mood) {
        return res.status(400).json({ message: "Entry text and mood are required" });
      }
      
      // Perform advanced analysis for risk assessment
      let riskLevel = 'low';
      try {
        const analysis = await analyzeMoodAdvanced(entryText);
        riskLevel = analysis.riskLevel;
      } catch (error) {
        console.error('Advanced analysis failed, using basic mood:', error);
      }
      
      const entry = await storage.createJournalEntry({
        userId,
        entryText,
        mood,
      });
      
      // Send emergency email if mood is suicidal or risk level is critical
      if (mood === 'suicidal' || riskLevel === 'critical') {
        await sendEmergencyEmail(req.user, entryText);
      }
      
      res.status(201).json({
        ...entry,
        riskLevel // Include risk level in response
      });
    } catch (error: any) {
      console.error("Save entry error:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  // Stats routes
  app.get("/api/user/stats", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error("Stats fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Mood tracking routes
  app.get("/api/mood/weekly", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const entries = await storage.getJournalEntriesInDateRange(userId, weekAgo, new Date());
      
      // Group by day and mood
      const moodData = entries.reduce((acc: any, entry) => {
        const day = entry.createdAt!.toISOString().split('T')[0];
        if (!acc[day]) acc[day] = {};
        acc[day][entry.mood] = (acc[day][entry.mood] || 0) + 1;
        return acc;
      }, {});
      
      res.json(moodData);
    } catch (error: any) {
      console.error("Weekly mood fetch error:", error);
      res.status(500).json({ message: "Failed to fetch weekly mood data" });
    }
  });

  // Save a quote
  app.post("/api/quotes/:quoteId/save", authenticateToken, async (req: any, res) => {
    try {
      const { quoteId } = req.params;
      const userId = req.user.id;
      
      const savedQuote = await storage.saveQuote(userId, quoteId);
      res.status(201).json(savedQuote);
    } catch (error: any) {
      console.error("Error saving quote:", error);
      res.status(500).json({ message: "Failed to save quote" });
    }
  });

  // Unsave a quote
  app.delete("/api/quotes/:quoteId/save", authenticateToken, async (req: any, res) => {
    try {
      const { quoteId } = req.params;
      const userId = req.user.id;
      
      await storage.unsaveQuote(userId, quoteId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error unsaving quote:", error);
      res.status(500).json({ message: "Failed to unsave quote" });
    }
  });

  // Get saved quotes
  app.get("/api/quotes/saved", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const savedQuotes = await storage.getSavedQuotes(userId);
      res.json(savedQuotes);
    } catch (error: any) {
      console.error("Error fetching saved quotes:", error);
      res.status(500).json({ message: "Failed to fetch saved quotes" });
    }
  });

  // Check if quote is saved
  app.get("/api/quotes/:quoteId/saved", authenticateToken, async (req: any, res) => {
    try {
      const { quoteId } = req.params;
      const userId = req.user.id;
      
      const isSaved = await storage.isQuoteSaved(userId, quoteId);
      res.json({ isSaved });
    } catch (error: any) {
      console.error("Error checking quote save status:", error);
      res.status(500).json({ message: "Failed to check quote save status" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: "connected",
        ai_analysis: "enabled",
        email: process.env.EMAIL_USER ? "configured" : "not configured"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
