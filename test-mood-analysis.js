// Test script to verify mood analysis functionality
import { analyzeMoodAdvanced, analyzeMoodSimple } from '../server/services/moodAnalysis.js';

const testEntries = [
  {
    text: "I feel so happy today! Everything is going wonderfully and I'm grateful for all the good things in my life.",
    expectedMood: "happy"
  },
  {
    text: "I'm feeling really anxious about tomorrow's presentation. My heart is racing and I can't stop worrying about it.",
    expectedMood: "anxious"
  },
  {
    text: "I feel so sad and empty today. Nothing seems to matter anymore and I just want to cry.",
    expectedMood: "sad"
  },
  {
    text: "Today was okay, nothing special happened. Just a regular day at work.",
    expectedMood: "neutral"
  },
  {
    text: "I'm so angry about what happened at work today. My boss was completely unfair and I'm furious.",
    expectedMood: "angry"
  }
];

async function testMoodAnalysis() {
  // Test script to demonstrate the 3-layer mood analysis system
import { analyzeMoodAdvanced } from './server/services/moodAnalysis.ts';

console.log("🧠 Daily Mood Check - Analysis System Test");
console.log("==========================================");

async function testMoodAnalysis() {
  // Test journal entry
  const testEntry = "I feel extremely overwhelmed at work today. My boss keeps giving me more projects and I can't seem to catch up. I'm losing sleep over this and feel anxious all the time. Sometimes I wonder if I'm just not good enough for this job.";
  
  console.log("
📝 Test Journal Entry:");
  console.log(`"${testEntry}"`);
  console.log("
🔍 Analysis Results:");
  console.log("===================");
  
  try {
    const result = await analyzeMoodAdvanced(testEntry);
    
    console.log("
🎯 PRIMARY ANALYSIS:");
    console.log(`Primary Mood: ${result.primaryMood}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Intensity: ${result.intensity}`);
    console.log(`Risk Level: ${result.riskLevel}`);
    
    if (result.secondaryMoods.length > 0) {
      console.log("
🔄 SECONDARY MOODS:");
      result.secondaryMoods.forEach(mood => {
        console.log(`- ${mood.mood}: ${(mood.confidence * 100).toFixed(1)}%`);
      });
    }
    
    console.log("
📊 ANALYSIS BREAKDOWN:");
    console.log("=====================");
    
    // Layer 1: Keywords
    console.log("
🔤 Layer 1 - Keyword Analysis:");
    Object.entries(result.analysis.keywordMatches).forEach(([mood, keywords]) => {
      console.log(`${mood}: [${keywords.join(', ')}]`);
    });
    
    // Layer 2: Sentiment
    console.log("
📈 Layer 2 - Sentiment Analysis:");
    console.log(`Score: ${result.sentimentScore}`);
    console.log(`Negative words: [${result.analysis.sentimentBreakdown.negative?.join(', ') || 'none'}]`);
    console.log(`Positive words: [${result.analysis.sentimentBreakdown.positive?.join(', ') || 'none'}]`);
    
    // Layer 3: OpenAI
    console.log("
🤖 Layer 3 - OpenAI AI Analysis:");
    if (result.analysis.aiInsights) {
      console.log(`✅ ENABLED: ${result.analysis.aiInsights}`);
    } else {
      console.log("❌ DISABLED: No OpenAI API key or API call failed");
    }
    
    // Triggers
    if (result.triggers && result.triggers.length > 0) {
      console.log("
🎯 DETECTED TRIGGERS:");
      result.triggers.forEach(trigger => console.log(`- ${trigger}`));
    }
    
    // Recommendations
    console.log("
💡 RECOMMENDATIONS:");
    result.recommendations.forEach(rec => console.log(`- ${rec}`));
    
  } catch (error) {
    console.error("❌ Analysis failed:", error);
  }
}

// Run the test
testMoodAnalysis().then(() => {
  console.log("
✅ Test completed!");
  process.exit(0);
}).catch(error => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
  
  for (const entry of testEntries) {
    console.log(`📝 Testing: "${entry.text.substring(0, 50)}..."`);
    
    try {
      // Test simple analysis
      const simpleMood = analyzeMoodSimple(entry.text);
      console.log(`   Simple Analysis: ${simpleMood}`);
      
      // Test advanced analysis
      const advancedResult = await analyzeMoodAdvanced(entry.text);
      console.log(`   Advanced Analysis:`);
      console.log(`     Primary Mood: ${advancedResult.primaryMood}`);
      console.log(`     Confidence: ${Math.round(advancedResult.confidence * 100)}%`);
      console.log(`     Intensity: ${advancedResult.intensity}`);
      console.log(`     Risk Level: ${advancedResult.riskLevel}`);
      console.log(`     Sentiment Score: ${advancedResult.sentimentScore}`);
      
      if (advancedResult.triggers && advancedResult.triggers.length > 0) {
        console.log(`     Triggers: ${advancedResult.triggers.join(', ')}`);
      }
      
      if (advancedResult.recommendations && advancedResult.recommendations.length > 0) {
        console.log(`     Top Recommendation: ${advancedResult.recommendations[0]}`);
      }
      
      console.log(`   ✅ Expected: ${entry.expectedMood} | Got: ${advancedResult.primaryMood}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log("");
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMoodAnalysis().catch(console.error);
}

export { testMoodAnalysis };
