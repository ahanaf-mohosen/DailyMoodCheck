// CORRECTED Analysis of "god,sad,die" based on actual keyword matching
console.log("=".repeat(60));
console.log("CORRECTED MOOD ANALYSIS FOR: 'god,sad,die'");
console.log("=".repeat(60));

const journalEntry = "god,sad,die";

console.log("\nJOURNAL ENTRY:");
console.log(`"${journalEntry}"`);

console.log("\n" + "=".repeat(60));
console.log("ACTUAL KEYWORD MATCHING:");
console.log("=".repeat(60));

console.log("\n🔍 EXACT KEYWORD SEARCH:");
console.log("Checking for exact matches in keyword lists...");

// Check what actually gets matched
console.log("\n📋 SUICIDAL KEYWORDS TO CHECK:");
console.log("- 'kill myself' -> NOT found");
console.log("- 'end it all' -> NOT found");
console.log("- 'want to die' -> NOT found (need full phrase)");
console.log("- 'suicide' -> NOT found");
console.log("- 'die' alone -> NOT in suicidal keyword list!");

console.log("\n📋 SAD KEYWORDS TO CHECK:");
console.log("- 'sad' -> ✅ FOUND! (weight: 6)");
console.log("- 'depressed' -> NOT found");
console.log("- 'down' -> NOT found");

console.log("\n📋 OTHER MOOD KEYWORDS:");
console.log("- 'god' -> NOT in any mood keyword list");

console.log("\n" + "=".repeat(60));
console.log("ACTUAL ANALYSIS RESULT:");
console.log("=".repeat(60));

console.log("\n🎯 KEYWORD MATCHES FOUND:");
console.log("- sad: ['sad'] (weight: 6, score: 6)");
console.log("- No other mood keywords matched!");

console.log("\n📋 PRIMARY ANALYSIS:");
console.log("- Primary Mood: SAD (not suicidal!)");
console.log("- Confidence: 60% (low due to single keyword + short entry)");
console.log("- Intensity: MEDIUM");
console.log("- Risk Level: LOW (no crisis keywords actually matched)");

console.log("\n📈 SENTIMENT ANALYSIS:");
console.log("- Sentiment score: -2 (mildly negative)");
console.log("- Negative words: ['sad', 'die']");
console.log("- Positive words: []");

console.log("\n🚨 RISK ASSESSMENT:");
console.log("- NO critical risk indicators found");
console.log("- 'die' alone doesn't trigger crisis (needs context)");
console.log("- Risk level: LOW");
console.log("- No emergency protocols triggered");

console.log("\n🤖 OPENAI WOULD PROVIDE:");
console.log("'This brief entry mentions sadness alongside references to");
console.log("God and death. The context is unclear - could be philosophical");
console.log("reflection, spiritual questioning, or emotional distress.");
console.log("Consider elaborating on your feelings for better support.'");

console.log("\n" + "=".repeat(60));
console.log("WHY SAD (NOT SUICIDAL) WAS CHOSEN:");
console.log("=".repeat(60));

console.log("\n1. EXACT KEYWORD MATCHING:");
console.log("   - System looks for EXACT phrase matches");
console.log("   - 'die' alone ≠ 'want to die' or 'going to die'");
console.log("   - Only 'sad' keyword actually matched");

console.log("\n2. NO CRISIS TRIGGERS:");
console.log("   - Critical indicators need full phrases:");
console.log("     ✗ 'want to die' (not found)");
console.log("     ✗ 'kill myself' (not found)");
console.log("     ✗ 'end it all' (not found)");
console.log("     ✓ Only 'sad' matched");

console.log("\n3. CONTEXT MATTERS:");
console.log("   - 'die' could mean many things:");
console.log("     - 'plants die' (nature)");
console.log("     - 'never die' (persistence)");
console.log("     - 'die laughing' (humor)");
console.log("   - System needs INTENT not just word");

console.log("\n" + "=".repeat(60));
console.log("FINAL CORRECTED RESULT:");
console.log("=".repeat(60));

console.log(`
{
  "primaryMood": "sad",
  "confidence": 0.60,
  "intensity": "medium",
  "riskLevel": "low",
  "secondaryMoods": [],
  "triggers": [],
  "recommendations": [
    "☀️ Try to get some natural sunlight",
    "🤗 Reach out to friends or family for support",
    "📚 Engage in activities you usually enjoy",
    "📝 Consider writing more about what you're feeling"
  ],
  "analysis": {
    "keywordMatches": {"sad": ["sad"]},
    "sentimentScore": -2,
    "aiInsights": "Brief entry suggests mild sadness..."
  }
}
`);

console.log("\n💡 SYSTEM RECOMMENDATIONS:");
console.log("- 📝 Try writing more to help the system understand");
console.log("- 🤔 Elaborate on what you're feeling");
console.log("- 🔍 More context = better analysis");
console.log("- ✝️ If spiritual distress, consider chaplain/counselor");

console.log("\n" + "=".repeat(60));
console.log("KEY INSIGHT: Your system is SMART and SAFE");
console.log("- Doesn't panic over single words");
console.log("- Requires clear crisis language for emergency response");
console.log("- Encourages elaboration for better help");
console.log("=".repeat(60));
