import Sentiment from 'sentiment';
import natural from 'natural';
import OpenAI from 'openai';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Initialize OpenAI (optional - requires API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Enhanced mood keywords with weights
export const enhancedMoodKeywords = {
  suicidal: {
    keywords: [
      'kill myself', 'end it all', 'want to die', 'suicide', 'no point living',
      'worthless', 'hopeless', 'give up', 'better off dead', 'ending my life',
      'can\'t go on', 'nothing to live for', 'tired of living', 'want to disappear',
      'harm myself', 'self harm', 'cutting', 'overdose', 'hanging', 'jump off'
    ],
    weight: 10
  },
  severely_depressed: {
    keywords: [
      'severely depressed', 'extremely sad', 'completely hopeless', 'utterly despair',
      'can\'t function', 'barely surviving', 'deep depression', 'overwhelming sadness',
      'can\'t get out of bed', 'lost all hope', 'everything is pointless', 'numb inside'
    ],
    weight: 8
  },
  sad: {
    keywords: [
      'sad', 'depressed', 'down', 'crying', 'tears', 'grief', 'loss', 'mourning',
      'lonely', 'empty', 'disappointed', 'heartbroken', 'devastated', 'miserable',
      'gloomy', 'melancholy', 'sorrowful', 'blue', 'upset', 'hurt', 'pain'
    ],
    weight: 6
  },
  anxious: {
    keywords: [
      'anxious', 'worried', 'stress', 'nervous', 'panic', 'fear', 'scared', 'afraid',
      'overwhelmed', 'restless', 'tense', 'uneasy', 'concerned', 'apprehensive',
      'paranoid', 'on edge', 'can\'t relax', 'racing thoughts', 'catastrophizing'
    ],
    weight: 5
  },
  angry: {
    keywords: [
      'angry', 'furious', 'rage', 'mad', 'pissed', 'frustrated', 'irritated',
      'annoyed', 'livid', 'outraged', 'infuriated', 'hostile', 'aggressive',
      'resentful', 'bitter', 'hate', 'disgusted', 'fed up'
    ],
    weight: 4
  },
  neutral: {
    keywords: [
      'okay', 'fine', 'alright', 'normal', 'regular', 'usual', 'average',
      'so-so', 'meh', 'nothing special', 'typical', 'ordinary', 'routine'
    ],
    weight: 3
  },
  content: {
    keywords: [
      'content', 'satisfied', 'peaceful', 'calm', 'relaxed', 'comfortable',
      'pleasant', 'good', 'positive', 'stable', 'balanced', 'serene'
    ],
    weight: 2
  },
  happy: {
    keywords: [
      'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love',
      'grateful', 'blessed', 'fantastic', 'excellent', 'thrilled', 'delighted',
      'cheerful', 'upbeat', 'optimistic', 'elated', 'ecstatic', 'blissful'
    ],
    weight: 1
  }
};

// Emotion intensity indicators
const intensityModifiers = {
  high: ['extremely', 'very', 'incredibly', 'utterly', 'completely', 'totally', 'absolutely', 'deeply'],
  medium: ['quite', 'rather', 'pretty', 'fairly', 'somewhat', 'moderately'],
  low: ['a bit', 'slightly', 'a little', 'kind of', 'sort of', 'mildly']
};

export interface MoodAnalysisResult {
  primaryMood: string;
  confidence: number;
  intensity: 'low' | 'medium' | 'high';
  secondaryMoods: Array<{ mood: string; confidence: number }>;
  sentimentScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  triggers?: string[];
  analysis: {
    keywordMatches: Record<string, string[]>;
    sentimentBreakdown: any;
    aiInsights?: string;
  };
}

// Advanced keyword-based analysis with context awareness
function analyzeWithKeywords(text: string): Partial<MoodAnalysisResult> {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  const moodScores: Record<string, number> = {};
  const keywordMatches: Record<string, string[]> = {};
  
  // Analyze each mood category
  Object.entries(enhancedMoodKeywords).forEach(([mood, { keywords, weight }]) => {
    const matches: string[] = [];
    let score = 0;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        matches.push(keyword);
        
        // Calculate base score
        let keywordScore = weight;
        
        // Check for intensity modifiers
        const keywordIndex = lowerText.indexOf(keyword);
        const contextBefore = lowerText.substring(Math.max(0, keywordIndex - 50), keywordIndex);
        const contextAfter = lowerText.substring(keywordIndex + keyword.length, keywordIndex + keyword.length + 50);
        const context = contextBefore + ' ' + contextAfter;
        
        // Apply intensity modifiers
        if (intensityModifiers.high.some(modifier => context.includes(modifier))) {
          keywordScore *= 1.5;
        } else if (intensityModifiers.medium.some(modifier => context.includes(modifier))) {
          keywordScore *= 1.2;
        } else if (intensityModifiers.low.some(modifier => context.includes(modifier))) {
          keywordScore *= 0.8;
        }
        
        score += keywordScore;
      }
    });
    
    if (matches.length > 0) {
      moodScores[mood] = score;
      keywordMatches[mood] = matches;
    }
  });
  
  // Find primary mood
  const sortedMoods = Object.entries(moodScores)
    .sort(([, a], [, b]) => b - a);
  
  const primaryMood = sortedMoods.length > 0 ? sortedMoods[0][0] : 'neutral';
  const maxScore = sortedMoods.length > 0 ? sortedMoods[0][1] : 0;
  
  // Calculate confidence based on score strength and keyword density
  const totalWords = words.length;
  const matchedWords = Object.values(keywordMatches).flat().length;
  const keywordDensity = matchedWords / totalWords;
  const confidence = Math.min(0.95, (maxScore / 10) * (1 + keywordDensity));
  
  // Determine intensity
  let intensity: 'low' | 'medium' | 'high' = 'medium';
  if (maxScore > 15) intensity = 'high';
  else if (maxScore < 5) intensity = 'low';
  
  // Get secondary moods
  const secondaryMoods = sortedMoods.slice(1, 3).map(([mood, score]) => ({
    mood,
    confidence: Math.min(0.9, score / (maxScore || 1) * confidence)
  }));
  
  return {
    primaryMood,
    confidence,
    intensity,
    secondaryMoods,
    analysis: { 
      keywordMatches,
      sentimentBreakdown: {} // Add missing property
    }
  };
}

// Sentiment analysis using the sentiment library
function analyzeSentiment(text: string): { score: number; breakdown: any } {
  const result = sentiment.analyze(text);
  return {
    score: result.score,
    breakdown: {
      positive: result.positive,
      negative: result.negative,
      tokens: result.tokens,
      words: result.words,
      comparative: result.comparative
    }
  };
}

// Risk assessment based on mood and content
function assessRisk(mood: string, intensity: string, sentimentScore: number, text: string): 'low' | 'medium' | 'high' | 'critical' {
  const lowerText = text.toLowerCase();
  
  // Critical risk indicators
  const criticalIndicators = [
    'kill myself', 'want to die', 'suicide', 'end it all', 'no point living',
    'better off dead', 'can\'t go on', 'harm myself', 'overdose'
  ];
  
  if (criticalIndicators.some(indicator => lowerText.includes(indicator))) {
    return 'critical';
  }
  
  if (mood === 'suicidal') return 'critical';
  if (mood === 'severely_depressed' && intensity === 'high') return 'high';
  if (mood === 'severely_depressed') return 'high';
  if ((mood === 'sad' || mood === 'anxious') && intensity === 'high') return 'medium';
  if (sentimentScore < -5) return 'medium';
  if (sentimentScore < -2) return 'low';
  
  return 'low';
}

// Generate recommendations based on mood and risk level
function generateRecommendations(mood: string, riskLevel: string, intensity: string): string[] {
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical') {
    recommendations.push(
      "🚨 Please reach out to someone you trust immediately",
      "📞 Consider calling a crisis helpline: 988 (US) or your local emergency number",
      "🏥 If you're in immediate danger, please go to your nearest emergency room",
      "👥 Contact a friend, family member, or mental health professional",
      "🌟 Remember: You matter and there are people who want to help"
    );
  } else if (riskLevel === 'high') {
    recommendations.push(
      "🤝 Consider reaching out to a mental health professional",
      "👨‍⚕️ Schedule an appointment with your doctor or therapist",
      "💬 Talk to someone you trust about how you're feeling",
      "🧘‍♀️ Try relaxation techniques like deep breathing or meditation",
      "🚶‍♀️ Gentle physical activity might help improve your mood"
    );
  } else if (mood === 'anxious') {
    recommendations.push(
      "🧘‍♀️ Practice deep breathing exercises",
      "📝 Try writing down your worries to externalize them",
      "🎵 Listen to calming music or nature sounds",
      "🌱 Consider grounding techniques (5-4-3-2-1 sensory method)",
      "☕ Limit caffeine intake which can increase anxiety"
    );
  } else if (mood === 'sad') {
    recommendations.push(
      "☀️ Try to get some natural sunlight",
      "🤗 Reach out to friends or family for support",
      "📚 Engage in activities you usually enjoy",
      "💤 Ensure you're getting adequate sleep",
      "🏃‍♀️ Light exercise can help boost mood"
    );
  } else if (mood === 'angry') {
    recommendations.push(
      "🥊 Try physical exercise to release tension",
      "📝 Write about what's bothering you",
      "🧘‍♀️ Practice mindfulness or meditation",
      "🗣️ Talk to someone about what's frustrating you",
      "⏰ Take a break from stressful situations if possible"
    );
  } else if (mood === 'happy') {
    recommendations.push(
      "🎉 Enjoy this positive moment",
      "📝 Consider writing about what made you happy",
      "🤝 Share your joy with others",
      "📸 Create positive memories",
      "🌟 Practice gratitude for the good things in your life"
    );
  } else {
    recommendations.push(
      "💭 Take time for self-reflection",
      "🌿 Practice mindfulness",
      "📚 Engage in activities that bring you joy",
      "🤝 Connect with others",
      "🎯 Set small, achievable goals for yourself"
    );
  }
  
  return recommendations;
}

// OpenAI-powered analysis (optional, requires API key)
async function analyzeWithOpenAI(text: string): Promise<string | null> {
  if (!openai) return null;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a compassionate mental health assistant. Analyze the following journal entry and provide insights about the person's emotional state, potential triggers, and helpful observations. Be empathetic and supportive. Keep your response under 200 words.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    return null;
  }
}

// Detect potential triggers
function detectTriggers(text: string): string[] {
  const triggers: string[] = [];
  const lowerText = text.toLowerCase();
  
  const triggerPatterns = {
    'work stress': ['work', 'job', 'boss', 'deadline', 'meeting', 'office', 'colleague'],
    'relationship issues': ['relationship', 'partner', 'boyfriend', 'girlfriend', 'marriage', 'divorce', 'breakup'],
    'family problems': ['family', 'parents', 'mother', 'father', 'siblings', 'children'],
    'financial stress': ['money', 'financial', 'debt', 'bills', 'budget', 'expensive', 'afford'],
    'health concerns': ['health', 'sick', 'illness', 'doctor', 'hospital', 'pain', 'medical'],
    'social anxiety': ['social', 'people', 'crowd', 'party', 'friends', 'awkward', 'embarrassed'],
    'academic pressure': ['school', 'college', 'university', 'exam', 'grade', 'homework', 'study'],
    'sleep issues': ['sleep', 'tired', 'exhausted', 'insomnia', 'nightmare', 'wake up']
  };
  
  Object.entries(triggerPatterns).forEach(([trigger, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      triggers.push(trigger);
    }
  });
  
  return triggers;
}

// Main analysis function
export async function analyzeMoodAdvanced(text: string): Promise<MoodAnalysisResult> {
  try {
    // Keyword-based analysis
    const keywordResult = analyzeWithKeywords(text);
    
    // Sentiment analysis
    const sentimentResult = analyzeSentiment(text);
    
    // Risk assessment
    const riskLevel = assessRisk(
      keywordResult.primaryMood || 'neutral',
      keywordResult.intensity || 'medium',
      sentimentResult.score,
      text
    );
    
    // Generate recommendations
    const recommendations = generateRecommendations(
      keywordResult.primaryMood || 'neutral',
      riskLevel,
      keywordResult.intensity || 'medium'
    );
    
    // Detect triggers
    const triggers = detectTriggers(text);
    
    // OpenAI analysis (if available)
    const aiInsights = await analyzeWithOpenAI(text);
    
    return {
      primaryMood: keywordResult.primaryMood || 'neutral',
      confidence: keywordResult.confidence || 0.5,
      intensity: keywordResult.intensity || 'medium',
      secondaryMoods: keywordResult.secondaryMoods || [],
      sentimentScore: sentimentResult.score,
      riskLevel,
      recommendations,
      triggers: triggers.length > 0 ? triggers : undefined,
      analysis: {
        keywordMatches: keywordResult.analysis?.keywordMatches || {},
        sentimentBreakdown: sentimentResult.breakdown,
        aiInsights: aiInsights || undefined
      }
    };
  } catch (error) {
    console.error('Mood analysis error:', error);
    
    // Fallback to simple analysis
    return {
      primaryMood: 'neutral',
      confidence: 0.3,
      intensity: 'medium',
      secondaryMoods: [],
      sentimentScore: 0,
      riskLevel: 'low',
      recommendations: ['💭 Take time for self-reflection', '🌿 Practice mindfulness'],
      analysis: {
        keywordMatches: {},
        sentimentBreakdown: {}
      }
    };
  }
}

// Simple mood analysis for backward compatibility
export function analyzeMoodSimple(text: string): string {
  const result = analyzeWithKeywords(text);
  return result.primaryMood || 'neutral';
}
