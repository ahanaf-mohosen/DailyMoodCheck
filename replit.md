# Daily Journal - Mood Tracking Application

## Overview

Daily Journal is a full-stack mood tracking application that allows users to write journal entries, analyze their mood, and track emotional patterns over time. The app includes safety features for mental health support, including automatic notifications to trusted contacts in crisis situations.

## User Preferences

Preferred communication style: Simple, everyday language.
- Mobile-friendly design with responsive sidebar navigation
- Profile icon should show user name and email with dropdown for logout and theme toggle
- Photo upload functionality instead of URL input
- Environment variables for sensitive configuration (JWT, email, OAuth credentials)

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Authentication**: JWT-based authentication with bcrypt for password hashing

## Key Components

### Frontend Architecture
- **React with TypeScript**: Modern React application with full TypeScript support
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theming support (light/dark mode)
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state, React Context for auth and theme

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Authentication**: JWT tokens with middleware for protected routes
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Email Service**: Nodemailer for verification codes and crisis notifications
- **Storage**: In-memory storage interface with plans for database migration

### Database Schema
The application uses three main entities:
- **Users**: Stores user information including trusted contact details
- **Journal Entries**: Contains journal text and analyzed mood data
- **Quotes**: Motivational quotes categorized by mood

## Data Flow

1. **User Registration**: Email verification process with trusted contact information
2. **Journal Entry**: User writes → Mood analysis → Quote suggestion → Entry saved
3. **Mood Tracking**: Aggregated mood data displayed in charts and statistics
4. **Crisis Detection**: Automatic email to trusted contact if suicidal mood detected

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- UI components (@radix-ui/* packages)
- Form handling (react-hook-form, @hookform/resolvers)
- Data fetching (@tanstack/react-query)
- Styling (tailwindcss, class-variance-authority, clsx)
- Charts (recharts for mood visualization)

### Backend Dependencies
- Express.js for server framework
- Authentication (bcrypt, jsonwebtoken)
- Database (drizzle-orm, @neondatabase/serverless)
- Email service (nodemailer)
- Development tools (tsx, esbuild)

### Development Tools
- Vite for frontend bundling and development
- TypeScript for type safety
- Drizzle Kit for database migrations
- ESBuild for backend bundling

## Deployment Strategy

The application is configured for deployment with:
- **Build Process**: Vite builds the frontend, ESBuild bundles the server
- **Database**: PostgreSQL with Drizzle migrations
- **Environment Variables**: JWT secrets, database URLs, SMTP credentials
- **Development**: Hot reload with Vite, TypeScript checking
- **Production**: Optimized builds with static asset serving

The architecture supports both development and production environments with appropriate configurations for each.

## Recent Changes

### Migration Completed (July 27, 2025)
- **Replit Agent Migration**: Successfully migrated from Replit Agent to standard Replit environment
- **Database Setup**: Created and configured PostgreSQL database with proper schema migration
- **Application Architecture**: Maintained client/server separation with security best practices
- **History Page**: Created dedicated history page with full journal entry viewing capability
- **Navigation Updates**: Added History and Saved Quotes links to sidebar navigation
- **Quote Management**: Maintained save/unsave functionality for quotes only (not auto-saved)
- **Clean Journal Interface**: Removed recent entries preview from journal page to reduce clutter

### Previous Features
- **Mobile-responsive navigation**: Added collapsible sidebar for desktop and mobile sheet navigation
- **Profile dropdown**: Implemented user profile dropdown with name, email, theme toggle, photo upload, and logout
- **Environment configuration**: Created .env.example for secure credential management
- **Photo upload**: Added client-side photo upload functionality with base64 storage and file validation
- **Clean layout**: Unified layout system with proper mobile responsiveness
- **Database migration**: Successfully migrated from in-memory storage to PostgreSQL database
- **Sample data**: Initialized database with motivational quotes for all mood types
- **Quotes system**: Complete save/unsave functionality with saved quotes history page
- **Automatic saving**: Journal entries now save automatically after mood analysis, removing manual save buttons