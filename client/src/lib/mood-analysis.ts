export const moodKeywords = {
  suicidal: [
    'kill myself', 'end it all', 'want to die', 'suicide', 'no point', 
    'worthless', 'hopeless', 'give up', 'better off dead', 'ending my life'
  ],
  sad: [
    'sad', 'depressed', 'down', 'crying', 'tears', 'grief', 'loss', 
    'lonely', 'empty', 'disappointed', 'heartbroken', 'devastated'
  ],
  anxious: [
    'anxious', 'worried', 'stress', 'nervous', 'panic', 'fear', 'scared', 
    'overwhelmed', 'restless', 'tense', 'uneasy', 'concerned'
  ],
  happy: [
    'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 
    'grateful', 'blessed', 'fantastic', 'excellent', 'thrilled', 'delighted'
  ],
};

export function analyzeMoodClient(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Check for suicidal indicators first (highest priority)
  if (moodKeywords.suicidal.some(keyword => lowerText.includes(keyword))) {
    return 'suicidal';
  }
  
  // Count mood indicators
  const moodScores = {
    sad: moodKeywords.sad.filter(keyword => lowerText.includes(keyword)).length,
    anxious: moodKeywords.anxious.filter(keyword => lowerText.includes(keyword)).length,
    happy: moodKeywords.happy.filter(keyword => lowerText.includes(keyword)).length,
  };
  
  // Return mood with highest score, or neutral if all scores are 0
  const maxMood = Object.keys(moodScores).reduce((a, b) => 
    moodScores[a as keyof typeof moodScores] > moodScores[b as keyof typeof moodScores] ? a : b
  );
  
  return moodScores[maxMood as keyof typeof moodScores] > 0 ? maxMood : 'neutral';
}

export const moodColors = {
  happy: 'hsl(142, 76%, 36%)',
  sad: 'hsl(221, 83%, 53%)',
  anxious: 'hsl(38, 92%, 50%)',
  suicidal: 'hsl(0, 84%, 60%)',
  neutral: 'hsl(220, 9%, 46%)',
};

export const moodEmojis = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  suicidal: '💔',
  neutral: '😐',
};
