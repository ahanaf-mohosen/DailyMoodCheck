# Daily Mood Check 🌟 - AI-Powered Mental Health Journal

A comprehensive mental health journaling application featuring **advanced 3-layer AI mood analysis**, crisis detection, personalized quotes, and detailed analytics to help users track and improve their emotional wellbeing.

![Daily Mood Check](https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop)

## 🎯 Key Features Overview

### 🧠 Advanced 3-Layer Mood Analysis System
Our sophisticated analysis engine combines three powerful approaches:

#### **Layer 1: Advanced Keyword Detection**
- **200+ emotion keywords** across 8 mood categories
- **Context-aware analysis** with intensity modifiers
- **Weighted scoring system** (Suicidal: 10, Severely Depressed: 8, Happy: 1)
- **Confidence scoring** based on keyword density and match strength

#### **Layer 2: Mathematical Sentiment Analysis**
- **Sentiment.js integration** for numerical emotion scoring
- **Positive/negative word pattern analysis**
- **Cross-validation** with keyword results
- **Mathematical confidence metrics**

#### **Layer 3: OpenAI GPT-3.5 Integration**
- **AI-powered deep insights** and emotional understanding
- **Contextual analysis** beyond simple keyword matching
- **Empathetic response generation**
- **Nuanced trigger identification**

### 🚨 Comprehensive Crisis Detection & Safety
- **Real-time risk assessment**: Critical, High, Medium, Low levels
- **Immediate intervention protocols** for suicidal ideation
- **Emergency contact notifications** via email alerts
- **Crisis resource recommendations** with hotline numbers
- **Safety-first approach** prioritizing user wellbeing

### 📊 Advanced Analytics & Insights
- **Interactive mood charts** with trend analysis
- **Risk timeline monitoring** with detailed breakdowns
- **Trigger correlation analysis** (work, relationships, health, etc.)
- **Pattern recognition** for long-term emotional health
- **Progress tracking** with streak counters and statistics

### 💝 Personalized Quote System
- **Mood-matched inspirational quotes** delivered after analysis
- **Database of categorized quotes** for different emotional states
- **Save favorite quotes** feature for later viewing
- **Crisis-specific supportive messages** for difficult times

## ✨ Enhanced Features

### 🎯 Smart Journal Experience
- **Real-time mood analysis** as you write
- **Visual mood indicators** with confidence percentages
- **Personalized recommendations** based on detected emotions
- **Trigger identification** with coping strategies
- **Crisis intervention** with immediate support resources

### 👤 Complete User Management
- **Secure authentication** with JWT tokens and bcrypt
- **Google OAuth integration** for easy login
- **Profile management** with trusted contact setup
- **Profile picture uploads** (now supporting larger files)
- **Email verification** and password reset functionality

### 📈 Comprehensive Analytics Dashboard
- **Weekly/Monthly trend analysis** with interactive charts
- **Mood distribution charts** showing emotional patterns
- **Risk level monitoring** with timeline visualization
- **Streak tracking** for consistent journaling habits
- **Detailed statistics** on emotional health progress

## 🛠️ Technology Stack

### Frontend Technologies
- **⚛️ React 18** with TypeScript for type-safe development
- **🎨 Tailwind CSS** with Shadcn/ui components for modern design
- **📊 Recharts** for interactive data visualization
- **🔄 TanStack Query** for efficient server state management
- **📱 Responsive design** optimized for mobile and desktop
- **⚡ Vite** for fast development and building

### Backend Infrastructure
- **🟢 Node.js** with Express.js framework
- **🐘 PostgreSQL** database with Drizzle ORM
- **🔐 Passport.js** for authentication strategies
- **📧 Nodemailer** for crisis email notifications
- **🤖 OpenAI API** integration for advanced analysis
- **📁 Multer** for secure file upload handling

### AI & Analysis Tools
- **🧠 OpenAI GPT-3.5** for deep emotional analysis
- **📊 Sentiment.js** for mathematical sentiment scoring
- **🔍 Natural language processing** for keyword detection
- **⚡ Real-time analysis** with confidence metrics

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** database (local or cloud)
- **OpenAI API key** (optional, for enhanced analysis)
- **Google OAuth credentials** (optional, for social login)
- **Email account** with app password (for crisis alerts)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahanaf-mohosen/DailyMoodCheck.git
   cd DailyMoodCheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual credentials:
   ```env
   # JWT Secret for authentication
   JWT_SECRET=your_secure_jwt_secret_here
   
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/dailymoodcheck
   
   # Email Configuration for crisis alerts
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # OpenAI API (Optional - for enhanced analysis)
   OPENAI_API_KEY=your_openai_api_key
   
   # Application Settings
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open `http://localhost:5000` in your browser

## 📁 Project Architecture

```
DailyMoodCheck/
├── 📁 client/                          # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   ├── 📁 layout/              # Layout components (Sidebar, TopBar)
│   │   │   ├── 📁 ui/                  # Shadcn/ui component library
│   │   │   └── QuoteGiftBox.tsx        # Post-analysis quote display
│   │   ├── 📁 contexts/                # React context providers
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📁 lib/                     # Utility functions & configurations
│   │   ├── 📁 pages/                   # Page components
│   │   │   ├── journal.tsx             # Main journaling interface
│   │   │   ├── mood-analytics.tsx      # Analytics dashboard
│   │   │   ├── history.tsx             # Journal entry history
│   │   │   └── profile.tsx             # User profile management
│   │   └── App.tsx                     # Main application component
│   └── index.html                      # HTML entry point
├── 📁 server/                          # Express.js backend
│   ├── 📁 services/                    # Business logic services
│   │   └── moodAnalysis.ts             # 3-layer mood analysis engine
│   ├── db.ts                           # Database connection setup
│   ├── index.ts                        # Server entry point & configuration
│   ├── routes.ts                       # API route definitions
│   └── storage.ts                      # Database operations & queries
├── 📁 shared/                          # Shared TypeScript definitions
│   └── schema.ts                       # Database schema & types
├── 📁 migrations/                      # Database migration files
├── 📄 MOOD_ANALYSIS_FEATURES.md        # Detailed analysis documentation
├── 📄 .env.example                     # Environment variables template
└── 📄 package.json                     # Project dependencies & scripts
```

## 🔬 Mood Analysis Documentation

### 🎯 Supported Mood Categories
1. **😊 Happy** - Joy, excitement, gratitude, love
2. **😌 Content** - Satisfaction, peace, comfort, stability  
3. **😐 Neutral** - Ordinary, routine, balanced experiences
4. **😰 Anxious** - Worry, stress, nervousness, panic
5. **😢 Sad** - Depression, loneliness, grief, disappointment
6. **😠 Angry** - Frustration, rage, irritation, resentment
7. **😭 Severely Depressed** - Deep sadness, hopelessness, despair
8. **🚨 Suicidal** - Crisis-level indicators requiring immediate intervention

### 🔍 Analysis Process
1. **Text preprocessing** and normalization
2. **Keyword pattern matching** with context awareness
3. **Sentiment scoring** using mathematical algorithms
4. **OpenAI analysis** for deep emotional insights (if configured)
5. **Risk assessment** with safety protocol activation
6. **Recommendation generation** based on detected patterns
7. **Quote selection** matching emotional state

### 📊 Confidence Metrics
- **High Confidence (80-95%)**: Strong keyword matches with clear patterns
- **Medium Confidence (60-79%)**: Moderate indicators with some ambiguity
- **Low Confidence (30-59%)**: Weak signals requiring human verification
- **Very Low Confidence (<30%)**: Insufficient data for reliable analysis

## 🚨 Crisis Detection System

### Risk Assessment Levels
- **🟢 Low Risk**: Normal emotional fluctuations
- **🟡 Medium Risk**: Elevated stress or sadness requiring attention
- **🟠 High Risk**: Concerning patterns suggesting professional help
- **🔴 Critical Risk**: Immediate intervention required with emergency protocols

### Crisis Response Protocol
1. **Automatic detection** of crisis keywords and patterns
2. **Immediate risk classification** and safety assessment
3. **Crisis resource provision** with hotline numbers and websites
4. **Emergency contact notification** via configured email alerts
5. **Professional help recommendations** with local resource directories

## 📊 Analytics Features

### Available Charts & Insights
- **📈 Mood Trend Analysis**: 7-day, 30-day, and yearly patterns
- **🍰 Mood Distribution**: Pie charts showing emotional balance
- **⚡ Risk Timeline**: Historical view of concerning entries
- **🎯 Trigger Analysis**: Correlation between life events and mood
- **📅 Calendar View**: Daily mood tracking with visual indicators
- **📊 Progress Metrics**: Improvement tracking and goal monitoring

### Statistics Dashboard
- **📝 Entry Count**: Daily, weekly, and monthly journaling frequency
- **🔥 Streaks**: Consecutive days of journaling habits
- **📊 Average Mood**: Baseline emotional state tracking
- **⚠️ Risk Patterns**: Identification of concerning trends
- **🎯 Most Common Triggers**: Frequently occurring stress factors

## 🔒 Security & Privacy

### Data Protection
- **🔐 Password encryption** using bcrypt with salt rounds
- **🛡️ JWT token authentication** with secure session management
- **📧 Email verification** for account security
- **🔒 Environment variable protection** for sensitive credentials
- **🚫 Git ignore for secrets** preventing accidental exposure

### Privacy Features
- **👤 Personal data encryption** in database storage
- **📱 Local data processing** when possible
- **🚫 No data selling** or third-party sharing
- **🗑️ Account deletion** with complete data removal
- **📋 Privacy controls** for data visibility and sharing

## 🌐 Deployment Guide

### Development Environment
```bash
npm run dev          # Start development server
npm run db:push      # Apply database schema changes
npm run build        # Build for production
```

### Production Deployment
1. **Set production environment variables**
2. **Configure PostgreSQL database**
3. **Set up email service (SMTP)**
4. **Configure domain and SSL certificates**
5. **Deploy using your preferred hosting platform**

### Recommended Hosting Platforms
- **🌐 Vercel** - Easy deployment with automatic SSL
- **🚀 Railway** - Simple PostgreSQL and app hosting
- **☁️ Heroku** - Traditional platform-as-a-service
- **🔧 VPS** - Full control with custom server setup

## 🤝 Contributing

We welcome contributions to improve Daily Mood Check! Here's how to get started:

### Development Workflow
1. **Fork the repository** and create a feature branch
2. **Set up your development environment** following the installation guide
3. **Make your changes** with appropriate tests and documentation
4. **Test thoroughly** including mood analysis and crisis detection
5. **Submit a pull request** with detailed description of changes

### Areas for Contribution
- **🧠 Enhanced AI analysis** algorithms and improvements
- **🎨 UI/UX improvements** for better user experience
- **📊 New analytics features** and visualization options
- **🌍 Internationalization** and multi-language support
- **♿ Accessibility improvements** for inclusive design
- **📚 Documentation** enhancements and tutorials

## 📞 Support & Resources

### Mental Health Resources
- **🇺🇸 National Suicide Prevention Lifeline**: 988
- **💬 Crisis Text Line**: Text HOME to 741741  
- **🌍 International Crisis Lines**: [Find local resources](https://findahelpline.com)
- **🧠 Mental Health America**: [mhanational.org](https://mhanational.org)

### Technical Support
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/ahanaf-mohosen/DailyMoodCheck/issues)
- **💡 Feature Requests**: Create an issue with enhancement label
- **📖 Documentation**: Check README and code comments
- **💬 Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Technology Partners
- **OpenAI** for advanced natural language processing
- **Shadcn/ui** for beautiful, accessible components
- **Vercel** for hosting and deployment platform
- **PostgreSQL** for reliable data storage

### Inspiration & Support
- **Mental health professionals** who provided domain expertise
- **Open source community** for tools and libraries
- **Users and testers** who provided valuable feedback
- **Contributors** who helped improve the application

---

**⚠️ Important Disclaimer**: Daily Mood Check is designed to support mental health tracking and self-reflection, but it is **not a replacement for professional mental health services**. If you're experiencing a mental health crisis, please contact emergency services or a qualified mental health professional immediately.

**🔒 Privacy Note**: Your journal entries and personal data are encrypted and stored securely. We never share your personal information with third parties, and you maintain full control over your data.
