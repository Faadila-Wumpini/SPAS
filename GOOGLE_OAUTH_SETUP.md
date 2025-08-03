# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Step 4: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 5: Test the Authentication

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign In" or "Sign Up"
4. Click "Continue with Google"
5. Complete the Google OAuth flow

## Features Added

✅ **Google OAuth Integration**
- Sign in with Google
- Sign up with Google
- Automatic session management
- Secure token handling

✅ **Updated UI**
- Google sign-in buttons on both login and signup pages
- Proper session state management
- User name display in navigation

✅ **Security**
- NextAuth.js handles all security aspects
- Secure session management
- CSRF protection
- Proper redirect handling 