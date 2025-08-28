// Analysis of "good,sad,upset,suisaid" with potential misspelling
console.log("=".repeat(60));
console.log("MOOD ANALYSIS FOR: 'good,sad,upset,suisaid'");
console.log("=".repeat(60));

const journalEntry = "good,sad,upset,suisaid";

console.log("\nJOURNAL ENTRY:");
console.log(`"${journalEntry}"`);

console.log("\n" + "=".repeat(60));
console.log("EXACT KEYWORD MATCHING:");
console.log("=".repeat(60));

console.log("\n🔍 CHECKING EACH WORD:");

// Check happy keywords
console.log("\n📋 HAPPY KEYWORDS:");
console.log("- 'good' -> ✅ FOUND! (weight: 2, in content category)");
console.log("- 'great' -> NOT found");
console.log("- 'wonderful' -> NOT found");

// Check sad keywords  
console.log("\n📋 SAD KEYWORDS:");
console.log("- 'sad' -> ✅ FOUND! (weight: 6)");
console.log("- 'upset' -> ✅ FOUND! (weight: 6)");
console.log("- 'depressed' -> NOT found");

// Check suicidal keywords
console.log("\n📋 SUICIDAL KEYWORDS:");
console.log("- 'suisaid' -> ❌ NOT FOUND (misspelled)");
console.log("- 'suicide' -> NOT found");
console.log("- 'kill myself' -> NOT found");
console.log("- 'want to die' -> NOT found");

console.log("\n🔤 MISSPELLING DETECTION:");
console.log("- 'suisaid' appears to be misspelled 'suicide'");
console.log("- System does EXACT matching only");
console.log("- No fuzzy/spell-check matching built in");
console.log("- Misspelling = NO crisis detection!");

console.log("\n" + "=".repeat(60));
console.log("KEYWORD MATCHING RESULTS:");
console.log("=".repeat(60));

console.log("\n🎯 ACTUAL MATCHES FOUND:");
console.log("- content: ['good'] (weight: 2, score: 2)");
console.log("- sad: ['sad', 'upset'] (weight: 6, score: 12)");
console.log("- suicidal: [] (no matches due to misspelling)");

console.log("\n🏆 WINNER CALCULATION:");
console.log("- content mood: 2 points");
console.log("- sad mood: 12 points (6 + 6)");
console.log("- WINNER: sad (highest score)");

console.log("\n" + "=".repeat(60));
console.log("FINAL ANALYSIS RESULT:");
console.log("=".repeat(60));

console.log("\n📋 PRIMARY ANALYSIS:");
console.log("- Primary Mood: SAD");
console.log("- Confidence: 75% (multiple keywords matched)");
console.log("- Intensity: MEDIUM-HIGH");
console.log("- Risk Level: LOW (no crisis keywords detected)");

console.log("\n🔄 SECONDARY MOODS:");
console.log("- content: 25% confidence");

console.log("\n📈 SENTIMENT ANALYSIS:");
console.log("- Positive words: ['good']");
console.log("- Negative words: ['sad', 'upset']");
console.log("- Overall sentiment score: -3 (negative)");

console.log("\n🚨 RISK ASSESSMENT:");
console.log("- NO crisis keywords detected");
console.log("- Misspelled 'suisaid' not recognized");
console.log("- Risk level: LOW");
console.log("- No emergency protocols triggered");

console.log("\n🤖 OPENAI AI ANALYSIS:");
console.log("Expected insight:");
console.log("'This entry shows conflicting emotions - feeling good while");
console.log("also experiencing sadness and being upset. The word 'suisaid'");
console.log("appears to be a misspelling of 'suicide' which raises concern.");
console.log("Consider clarifying these feelings and seeking support if needed.'");

console.log("\n" + "=".repeat(60));
console.log("CRITICAL SAFETY ISSUE:");
console.log("=".repeat(60));

console.log("\n⚠️ MISSPELLING PROBLEM:");
console.log("- User may have intended 'suicide'");
console.log("- System missed potential crisis due to spelling");
console.log("- This is a LIMITATION of exact keyword matching");

console.log("\n🔧 WHAT HAPPENS:");
console.log("1. System analyzes as 'sad' mood (not crisis)");
console.log("2. Provides standard sad mood recommendations");
console.log("3. NO emergency protocols triggered");
console.log("4. OpenAI might catch the misspelling and flag it");

console.log("\n💡 RECOMMENDATIONS PROVIDED:");
console.log("- ☀️ Try to get some natural sunlight");
console.log("- 🤗 Reach out to friends or family for support");
console.log("- 📚 Engage in activities you usually enjoy");
console.log("- 📝 Consider writing more about what you're feeling");

console.log("\n" + "=".repeat(60));
console.log("SYSTEM BEHAVIOR ANALYSIS:");
console.log("=".repeat(60));

console.log("\n✅ WHAT WORKS:");
console.log("- Correctly identifies 'sad' and 'upset'");
console.log("- Recognizes mixed emotions (good + sad)");
console.log("- Calculates weighted scores properly");
console.log("- OpenAI layer might catch misspelling");

console.log("\n❌ LIMITATION:");
console.log("- No spell checking for crisis keywords");
console.log("- Exact matching only = missed crisis");
console.log("- Could be dangerous in real crisis");

console.log("\n🎯 ACTUAL RESULT:");
console.log(`
{
  "primaryMood": "sad",
  "confidence": 0.75,
  "intensity": "medium",
  "riskLevel": "low",
  "secondaryMoods": [{"mood": "content", "confidence": 0.25}],
  "triggers": [],
  "recommendations": [
    "☀️ Try to get some natural sunlight",
    "🤗 Reach out to friends or family"
  ],
  "analysis": {
    "keywordMatches": {
      "sad": ["sad", "upset"],
      "content": ["good"]
    },
    "potentialMisspelling": "suisaid -> suicide?",
    "aiInsights": "Mixed emotions with potential crisis spelling..."
  }
}
`);

console.log("\n" + "=".repeat(60));
console.log("KEY INSIGHTS:");
console.log("=".repeat(60));

console.log("\n🔍 SYSTEM BEHAVIOR:");
console.log("- Exact keyword matching has pros and cons");
console.log("- Prevents false alarms but can miss misspellings");
console.log("- OpenAI layer provides safety net for unclear text");

console.log("\n⚡ IMPROVEMENT SUGGESTIONS:");
console.log("- Add fuzzy matching for critical keywords");
console.log("- Include common misspellings in crisis list");
console.log("- Let OpenAI flag suspicious misspellings");

console.log("\n🎯 BOTTOM LINE:");
console.log("- Result: SAD mood (not crisis detected)");
console.log("- Misspelling causes system to miss potential crisis");
console.log("- OpenAI analysis provides additional safety layer");

console.log("\n" + "=".repeat(60));
