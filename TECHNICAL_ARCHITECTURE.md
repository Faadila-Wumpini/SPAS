# SPAS Technical Architecture

<style>
body { font-size: 12px; }
h1 { font-size: 18px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4 { font-size: 13px; }
p, li { font-size: 11px; }
code { font-size: 10px; }
</style>

## System Overview

SPAS (Smart Power Alert System) is a full-stack web application built with Next.js 14, providing real-time power grid monitoring for Ghana's 16 regions. The system features user authentication, power data visualization, outage tracking, and historical trend analysis.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Middleware    │    │   Prisma ORM    │
│   (React)       │    │   (Auth)        │    │   (Client)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Theme Support**: next-themes for dark/light mode

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: MySQL 8.0
- **ORM**: Prisma 6.13+
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Email Service**: EmailJS integration

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database**: Prisma Studio

## Database Design

### Schema Overview
```sql
-- Users table for authentication
CREATE TABLE users (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
```

### Prisma Schema
```prisma
model User {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  hashed_password String
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  @@map("users")
}
```

## API Architecture

### Authentication Flow
1. **Registration**: User submits credentials → Validation → Password hashing → User creation → JWT generation
2. **Login**: User submits credentials → Validation → Password verification → JWT generation
3. **Authentication**: JWT verification → User context → Protected routes

### Power Data Flow
1. **Data Source**: CSV file with regional power data
2. **API Processing**: Parse CSV → Transform data → Return JSON
3. **Client Consumption**: Fetch data → State management → UI rendering

## Security Implementation

### Authentication Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token generation and verification
- **HTTP-Only Cookies**: XSS protection
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM

### Data Security
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Next.js built-in CORS handling
- **Error Handling**: Secure error messages
- **Session Management**: Automatic token expiration

## Data Flow

### Power Data Processing
```
CSV File → API Route → Data Parsing → JSON Response → Client → UI Components
```

### Authentication Flow
```
User Input → Validation → Database Query → Token Generation → Cookie Setting
```

### Real-time Updates
```
Data Source → API Polling → State Update → UI Re-render
```

## Component Architecture

### Frontend Components
```
App Layout
├── Navigation
├── Authentication Pages
│   ├── Login Form
│   └── Signup Form
├── Dashboard
│   ├── Power Metrics
│   ├── Regional Data
│   └── Charts
├── Settings Page
│   ├── User Preferences
│   └── Profile Management
├── Outages Page
│   ├── Outage Tracking
│   └── Status Updates
├── Help & Support
└── Utility Components
    ├── Loading States
    ├── Error Boundaries
    └── Notifications
```

### API Structure
```
/api
├── /auth
│   ├── /signup (POST)
│   ├── /login (POST)
│   ├── /logout (POST)
│   └── /me (GET)
└── /power-data
    ├── / (GET)
    └── /trends (GET)
```

## Performance Considerations

### Database Optimization
- **Connection Pooling**: Prisma automatic management
- **Indexing**: Primary and unique key indexes
- **Query Optimization**: Efficient Prisma queries

### Frontend Optimization
- **Code Splitting**: Next.js automatic splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Browser and server-side caching
- **Bundle Optimization**: Tree shaking and minification

### API Optimization
- **Response Caching**: Static data caching
- **Error Handling**: Graceful error responses
- **Validation**: Early validation to prevent processing

## Deployment Architecture

### Development Environment
- **Local Database**: MySQL running locally
- **Development Server**: Next.js dev server
- **Hot Reloading**: Automatic code updates

### Production Considerations
- **Database**: Managed MySQL service
- **Application**: Vercel/Netlify deployment
- **Environment Variables**: Secure configuration
- **Monitoring**: Application and database monitoring

## Monitoring and Logging

### Application Monitoring
- **Error Tracking**: Console error logging
- **Performance Monitoring**: API response times
- **User Analytics**: Authentication attempts

### Database Monitoring
- **Connection Pool**: Monitor connection usage
- **Query Performance**: Track slow queries
- **Storage**: Monitor disk space usage

## Security Best Practices

### Authentication
- Strong password requirements
- Secure token storage
- Automatic session expiration
- Rate limiting (future implementation)

### Data Protection
- Input sanitization
- Output encoding
- Secure headers
- HTTPS enforcement

### Environment Security
- Secure environment variables
- Database access controls
- API key management
- Regular security updates

## Scalability Considerations

### Database Scaling
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: Efficient connection management
- **Query Optimization**: Indexed queries

### Application Scaling
- **Horizontal Scaling**: Multiple server instances
- **CDN**: Static asset delivery
- **Caching**: Redis for session storage

### API Scaling
- **Rate Limiting**: Prevent abuse
- **Load Balancing**: Distribute traffic
- **Monitoring**: Track API usage

## Future Enhancements

### Planned Features
- **Real-time WebSocket**: Live data updates
- **Push Notifications**: Outage alerts
- **Mobile App**: React Native implementation
- **Advanced Analytics**: Machine learning insights
- **Enhanced User Management**: Role-based access control
- **API Rate Limiting**: Improved security and performance

### Technical Improvements
- **Microservices**: Service decomposition
- **GraphQL**: Flexible data fetching
- **Redis**: Caching layer
- **Docker**: Containerization
- **Turbopack**: Faster development builds
- **Edge Runtime**: Improved performance

---

**Last Updated:** January 2025
**Version:** 1.1.0 