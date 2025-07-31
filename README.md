# Daily Mood Tracker 🌟

A comprehensive mental health journaling application with AI-powered mood analysis, crisis detection, and support systems to help users track their emotional wellbeing.

![Daily Mood Tracker](https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop)

## ✨ Features

### 🎯 Core Functionality
- **Daily Journaling**: Write and save daily thoughts and reflections
- **AI Mood Analysis**: Automatic mood detection from journal entries
- **Crisis Detection**: AI-powered identification of concerning content with immediate alerts
- **Mood Visualization**: Interactive charts showing mood trends over time
- **Trusted Person Alerts**: Automatic notifications to designated contacts during crises

### 👤 User Management
- **Secure Authentication**: Email/password login with session management
- **Profile Management**: Update personal information and trusted contacts
- **Profile Images**: Upload and manage profile pictures
- **Data Privacy**: Secure handling of sensitive mental health data

### 📊 Analytics & Insights
- **Weekly Mood Charts**: Visual representation of mood patterns
- **Consistency Tracking**: Monitor journaling habits and streaks
- **Mood Statistics**: Dominant mood analysis and entry counting
- **Historical Data**: Access to past journal entries and mood trends

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management
- **Recharts** - Interactive data visualization
- **Shadcn/ui** - Modern component library
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database operations
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Nodemailer** - Email service integration
- **Multer** - File upload handling

### Additional Tools
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **ESBuild** - Fast JavaScript bundler
- **Drizzle Kit** - Database migration tool

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Gmail account for email services (or other SMTP provider)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/daily-mood-tracker.git
   cd daily-mood-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/dailymoodmate_dev
   
   # Email configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=Daily Journal <your-email@gmail.com>
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
daily-mood-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express application
│   ├── services/           # Business logic services
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
├── migrations/             # Database migration files
└── package.json
```

## 🎨 Key Components

### Frontend Components
- **Sidebar**: Navigation menu with responsive design
- **JournalEntry**: Rich text editor for daily entries
- **MoodChart**: Interactive mood visualization
- **GiftBox**: Motivational quotes after journal submission
- **ProfileDropdown**: User account management

### Backend Services
- **moodAnalyzer**: AI-powered mood detection from text
- **emailService**: Crisis alert notification system
- **Authentication**: Secure user login and session management

## 🔒 Security Features

- **Password Hashing**: bcrypt encryption for secure password storage
- **Session Management**: Secure session handling with PostgreSQL store
- **Input Validation**: Zod schema validation for all user inputs
- **CSRF Protection**: Built-in Express security measures
- **Crisis Detection**: Automated monitoring for concerning content

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Trusted person contact details
- Profile image storage

### Journal Entries Table
- Daily journal text content
- AI-analyzed mood classifications
- Timestamp tracking

### Quotes Table
- Motivational quotes categorized by mood
- Inspirational content delivery system

## 🚨 Crisis Detection System

The application includes an advanced crisis detection system that:
- Analyzes journal entries for concerning keywords
- Automatically identifies potential suicidal ideation
- Sends immediate email alerts to trusted contacts
- Provides crisis resources and hotline information
- Maintains user privacy while ensuring safety

## 📈 Mood Analysis

The AI mood analyzer categorizes entries into:
- **Happy**: Positive emotions and experiences
- **Sad**: Feelings of sadness or depression
- **Anxious**: Stress, worry, and anxiety indicators
- **Neutral**: Balanced or everyday experiences
- **Crisis**: Concerning content requiring immediate attention

## 🌐 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly configured for your production environment, including:
- Production database URL
- SMTP credentials
- Session secrets
- File upload configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

### Mental Health Resources
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: [Crisis Centers](https://www.iasp.info/resources/Crisis_Centres/)

### Technical Support
- Create an issue on GitHub for bug reports
- Check the documentation for setup help
- Review the codebase for implementation details

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with mental health professionals' input
- Focused on user privacy and data security
- Inspired by the need for accessible mental health tools

---

**Note**: This application is designed to support mental health tracking but is not a replacement for professional mental health services. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
