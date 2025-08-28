# Enhanced AI-Powered Mood Analysis System

## Overview

Your Daily Mood Check journal application now includes an advanced AI-powered mood analysis system that provides deep insights into your emotional patterns and mental health trends.

## 🚀 New Features

### 1. Advanced Mood Analysis API

#### Enhanced Mood Detection
- **Multi-layered Analysis**: Combines keyword matching, sentiment analysis, and AI insights
- **Expanded Mood Categories**: Now detects 8 mood types:
  - Happy 😊
  - Content 😌
  - Neutral 😐
  - Anxious 😰
  - Sad 😢
  - Angry 😡
  - Severely Depressed 😔
  - Suicidal 💔

#### Intelligence Features
- **Confidence Scoring**: Shows how certain the analysis is about the detected mood
- **Intensity Levels**: Measures emotional intensity (low, medium, high)
- **Risk Assessment**: Automatically evaluates mental health risk levels
- **Trigger Detection**: Identifies potential stress triggers (work, relationships, health, etc.)
- **Secondary Mood Analysis**: Detects mixed emotions

### 2. New API Endpoints

#### `/api/journal/analyze-advanced` (POST)
Advanced mood analysis with detailed insights:
```json
{
  "primaryMood": "anxious",
  "confidence": 0.85,
  "intensity": "high",
  "secondaryMoods": [
    {"mood": "sad", "confidence": 0.6}
  ],
  "sentimentScore": -3,
  "riskLevel": "medium",
  "recommendations": [
    "🧘‍♀️ Practice deep breathing exercises",
    "📝 Try writing down your worries"
  ],
  "triggers": ["work stress", "financial stress"],
  "analysis": {
    "keywordMatches": {...},
    "sentimentBreakdown": {...},
    "aiInsights": "You seem to be experiencing work-related anxiety..."
  }
}
```

#### `/api/journal/mood-patterns` (GET)
Comprehensive mood pattern analysis:
```json
{
  "moodDistribution": {"happy": 15, "sad": 8, "anxious": 12},
  "trend": "improving",
  "riskDays": [],
  "totalEntries": 35,
  "averageEntriesPerDay": 1.2,
  "insights": [
    "Your most common mood is happy (43% of entries)",
    "✨ Your mood trend is improving over the past week!"
  ]
}
```

### 3. Enhanced User Interface

#### Journal Page Improvements
- **Real-time Advanced Analysis**: Shows detailed mood breakdown with confidence scores
- **Visual Risk Indicators**: Color-coded risk levels and intensity meters
- **Personalized Recommendations**: AI-generated suggestions based on your mood
- **Crisis Support Integration**: Automatic display of crisis resources for high-risk entries
- **Trigger Identification**: Highlights potential stress triggers in your writing

#### New Mood Analytics Dashboard
- **Interactive Charts**: Pie charts for mood distribution, bar charts for weekly trends
- **Trend Analysis**: Visual indicators for mood improvement/decline
- **Risk Monitoring**: Timeline of concerning entries with risk levels
- **Pattern Insights**: AI-generated insights about your emotional patterns
- **Mental Health Metrics**: Comprehensive statistics and health indicators

### 4. Safety Features

#### Crisis Detection & Response
- **Automatic Risk Assessment**: Every journal entry is analyzed for suicide risk
- **Emergency Email Alerts**: Trusted contacts are automatically notified of high-risk entries
- **Crisis Resources**: Immediate display of helpline numbers and emergency contacts
- **Professional Recommendations**: Suggestions to seek professional help when needed

#### Privacy & Security
- **Local Processing**: Basic mood analysis runs locally for privacy
- **Optional AI Enhancement**: OpenAI integration is optional and configurable
- **Secure Data Handling**: All sensitive data is encrypted and protected

## 🛠️ Technical Implementation

### Backend Architecture
```
server/
├── services/
│   └── moodAnalysis.ts      # Advanced AI analysis engine
└── routes.ts                # Enhanced API endpoints
```

### AI/ML Libraries Used
- **Sentiment Analysis**: Uses the `sentiment` library for emotional scoring
- **Natural Language Processing**: `natural` library for text processing
- **OpenAI Integration**: Optional GPT-3.5 integration for deeper insights
- **Pattern Recognition**: Custom algorithms for mood pattern detection

### Database Enhancements
- **Risk Level Tracking**: Journal entries now include risk assessment
- **Mood Confidence Scores**: Stores analysis confidence for accuracy tracking
- **Trigger Categorization**: Automatically categorizes and tracks stress triggers

## 📊 Analytics & Insights

### Mood Distribution Analysis
- Visual pie charts showing your mood breakdown over time
- Percentage breakdowns of each emotional state
- Comparison across different time periods (7 days, 30 days, 90 days, 1 year)

### Trend Analysis
- **Improving**: Your mood has been getting better over time
- **Declining**: Recent entries show concerning patterns
- **Stable**: Your emotional state has been consistent

### Risk Monitoring
- Timeline of entries with high or critical risk levels
- Automated suggestions for professional support
- Integration with emergency contact system

### Personalized Insights
- AI-generated observations about your emotional patterns
- Recommendations for mood improvement
- Identification of positive coping strategies that work for you

## 🔧 Configuration

### Environment Variables
Add to your `.env` file:
```bash
# Optional: OpenAI API key for enhanced AI insights
OPENAI_API_KEY=your-openai-api-key-here

# Email configuration for crisis alerts
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Features by Configuration
- **Without OpenAI**: Basic mood analysis with sentiment scoring and keyword matching
- **With OpenAI**: Enhanced analysis with AI-generated insights and personalized recommendations
- **With Email**: Crisis alert system can notify trusted contacts
- **Without Email**: Crisis detection still works, but no automatic notifications

## 🚀 Usage Guide

### For Users
1. **Write Your Journal Entry**: Express your thoughts and feelings naturally
2. **Analyze Your Mood**: Click "Analyze My Mood" to get detailed insights
3. **Review Results**: See your primary mood, confidence level, and recommendations
4. **Save Your Entry**: Store your entry with the analyzed mood data
5. **Track Patterns**: Visit the Mood Analytics page to see long-term trends

### For Trusted Contacts
- Automatic email alerts for concerning entries
- Clear crisis resource information
- Professional guidance on how to help

## 🔒 Safety & Privacy

### Data Protection
- All journal entries are encrypted
- Mood analysis data is stored securely
- Optional AI processing with privacy controls

### Mental Health Safety
- Automatic crisis detection
- Professional resource recommendations
- Emergency contact integration
- Risk level monitoring

## 📈 Future Enhancements

### Planned Features
- **Mood Prediction**: AI-powered mood forecasting based on patterns
- **Therapy Integration**: Connect with mental health professionals
- **Group Support**: Anonymous peer support communities
- **Meditation Integration**: Guided mindfulness based on your mood
- **Wearable Integration**: Sync with fitness trackers for comprehensive health data

### Advanced Analytics
- **Trigger Correlation**: Advanced analysis of mood triggers and patterns
- **Intervention Recommendations**: Personalized suggestions for mood improvement
- **Progress Tracking**: Measure improvement over time with professional tools

## 🆘 Crisis Resources

### United States
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

### International
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/
- **Crisis Text Line (Canada)**: Text 686868
- **Samaritans (UK)**: 116 123

## 📞 Support

If you need help with the technical aspects of this system or have suggestions for improvements, please create an issue in the project repository or contact the development team.

Remember: This tool is designed to support your mental health journey, but it's not a replacement for professional mental health care. If you're experiencing a crisis, please reach out to a mental health professional or use the crisis resources listed above.

---

**Built with ❤️ for your mental health and well-being.**
