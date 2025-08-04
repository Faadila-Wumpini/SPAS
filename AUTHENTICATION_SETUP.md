# SPAS Authentication System Setup Guide

## Overview

This guide explains how to set up the new MySQL-based authentication system for the SPAS (Smart Power Alert System) Next.js application. The system has been completely migrated from NextAuth with Google OAuth to a custom email/password authentication system using Prisma ORM and MySQL.

## Features

- ✅ **Email/Password Authentication** - Secure user registration and login
- ✅ **MySQL Database** - Persistent user storage with Prisma ORM
- ✅ **JWT Tokens** - Secure session management with httpOnly cookies
- ✅ **Password Hashing** - bcrypt with salt rounds for security
- ✅ **Session Middleware** - Automatic route protection
- ✅ **Clean UI** - Updated login/signup forms without OAuth

## Database Schema

The system uses a simple but secure User table:

```sql
CREATE TABLE users (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (id),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

## Setup Instructions

### 1. Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE spas_auth;
   ```

2. **Run the schema script:**
   ```bash
   mysql -u your_username -p spas_auth < database-schema.sql
   ```

3. **Update Environment Variables:**
   Edit your `.env` file:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/spas_auth"
   JWT_SECRET="your-super-secure-jwt-secret-key-here"
   JWT_EXPIRES_IN="7d"
   ```

### 2. Install Dependencies

All required dependencies are already installed:
- `@prisma/client` - Database ORM client
- `prisma` - Database toolkit
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token management
- `js-cookie` - Client-side cookie handling

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations (Optional)

If you prefer using Prisma migrations:
```bash
npx prisma migrate dev --name init
```

## API Routes

The system provides the following API endpoints:

### Authentication Routes

- **POST** `/api/auth/signup` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - User login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user
  Requires authentication cookie or Bearer token.

- **POST** `/api/auth/logout` - User logout
  Clears authentication cookies.

## Frontend Integration

### Authentication Context

The app uses a custom React context (`/contexts/auth-context.tsx`) that provides:

- `user` - Current user object or null
- `login(email, password)` - Login function
- `signup(name, email, password)` - Signup function  
- `logout()` - Logout function
- `isLoading` - Loading state

### Usage Example

```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  )
}
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Original passwords are never stored in the database
- Minimum password length validation (6 characters)

### Session Security
- JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
- Secure flag enabled in production
- SameSite protection enabled
- 7-day token expiration (configurable)

### Route Protection
- Middleware automatically protects routes like `/settings`
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages

## File Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── lib/
│   ├── db.ts                  # Prisma client setup
│   └── auth.ts                # Authentication utilities
├── contexts/
│   └── auth-context.tsx       # React authentication context
├── app/api/auth/
│   ├── signup/route.ts        # Registration endpoint
│   ├── login/route.ts         # Login endpoint
│   ├── me/route.ts            # Current user endpoint
│   └── logout/route.ts        # Logout endpoint
├── app/auth/
│   ├── login/page.tsx         # Login page
│   └── signup/page.tsx        # Signup page
├── middleware.ts              # Route protection middleware
└── database-schema.sql        # MySQL setup script
```

## Testing the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration:**
   - Go to `http://localhost:3000/auth/signup`
   - Create a new account

3. **Test user login:**
   - Go to `http://localhost:3000/auth/login`  
   - Login with your credentials

4. **Test authentication:**
   - Visit protected routes like `/settings`
   - Check that you're redirected if not authenticated

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and user has permissions

### JWT Token Issues  
- Verify JWT_SECRET is set in .env
- Check browser cookies in DevTools
- Ensure cookies are being set correctly

### Build Issues
- Run `npx prisma generate` if Prisma client is missing
- Check all dependencies are installed
- Verify TypeScript types are correct

## Migration Notes

### Changes Made
- ✅ Removed NextAuth completely
- ✅ Removed Google OAuth functionality  
- ✅ Created custom authentication system
- ✅ Updated all frontend components
- ✅ Implemented secure cookie handling
- ✅ Added route protection middleware

### What's No Longer Needed
- Google OAuth credentials
- NextAuth configuration
- Session provider from NextAuth
- Express.js backend authentication (replaced with Next.js API routes)

The system is now fully self-contained within the Next.js application with no external authentication dependencies.