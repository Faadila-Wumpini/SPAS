# SPAS - Smart Power Alert System Documentation

<style>
body { font-size: 12px; }
h1 { font-size: 18px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4 { font-size: 13px; }
p, li { font-size: 11px; }
code { font-size: 10px; }
</style>

## Project Overview

SPAS (Smart Power Alert System) is a comprehensive power monitoring and alert system for Ghana's power grid. Built with Next.js 14, it provides real-time data visualization, outage tracking, user authentication, and power quality monitoring across all 16 regions of Ghana.

## Key Features

### Authentication System

- **User Registration & Login**: Secure JWT-based authentication
- **Password Hashing**: bcrypt encryption for security
- **Session Management**: HTTP-only cookies for token storage
- **Protected Routes**: Middleware-based route protection

### Power Monitoring Dashboard

- **Real-time Data**: Live voltage and frequency readings
- **Regional Overview**: Data for all 16 Ghanaian regions
- **Power Quality Trends**: Historical data visualization
- **Outage Tracking**: Active and scheduled outages
- **Interactive Charts**: Recharts-based data visualization

### Alert System

- **Outage Alerts**: Real-time outage notifications
- **Power Quality Warnings**: Voltage and frequency alerts
- **Regional Status**: Power stability indicators
- **User Impact**: Affected user counts

## Technical Architecture

### Frontend Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Context API

### Backend Stack

- **Runtime**: Node.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **API**: Next.js API Routes

### Data Sources

- **Power Data**: CSV-based regional data
- **Real-time Metrics**: Simulated live data
- **Historical Trends**: Generated time-series data

## Project Structure

```
SPAS/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication APIs
│   │   └── power-data/          # Power monitoring APIs
│   ├── auth/                     # Authentication pages
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── help/                     # Help documentation
│   ├── outages/                  # Outage management
│   ├── settings/                 # User settings
│   └── trends/                   # Data trends
├── components/                    # Reusable UI components
├── contexts/                     # React Context providers
├── data/                         # Static data files
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── prisma/                       # Database schema
└── public/                       # Static assets
```

## API Documentation

### Authentication APIs

#### POST `/api/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-08-05T20:59:56.915Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

#### POST `/api/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

#### POST `/api/auth/logout`

Logout current user.

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`

Get current user profile.

**Response (200):**

```json
{
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Power Data APIs

#### GET `/api/power-data`

Get power data for all regions.

**Response (200):**

```json
[
  {
    "regionName": "Greater Accra",
    "liveFrequency": 49.16,
    "liveVoltage": 220,
    "powerQualityTrend": "Stable",
    "activeOutages": [
      {
        "location": "Town A",
        "startTime": "2025-08-03 14:12",
        "duration": "2h",
        "usersAffected": 463,
        "cause": "Transformer fault"
      }
    ],
    "scheduledOutages": [...],
    "usersAffected": 3342,
    "averageVoltage": 224,
    "averageFrequency": 50.34,
    "powerStability": 79
  }
]
```

#### GET `/api/power-data/trends?region=Greater%20Accra`

Get historical trends for a specific region.

**Response (200):**

```json
[
  {
    "time": "14:00",
    "voltage": 224.5,
    "frequency": 50.2,
    "stability": 79.5
  }
]
```

## Database Schema

### User Table

```sql
CREATE TABLE users (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
```

## Data Sources

### Power Data CSV Structure

The system uses `data/power_data_regions_full.csv` with the following columns:

1. **Region Name**: Ghanaian region name
2. **Live Frequency (Hz)**: Current frequency reading
3. **Live Voltage (V)**: Current voltage reading
4. **Power Quality Trends**: Status (Stable/Fluctuating/Dropping)
5. **Active Outages**: Current outages (pipe-separated format)
6. **Scheduled Outages**: Planned outages
7. **Users Affected**: Total affected users
8. **Average Voltage (V)**: Historical average
9. **Average Frequency (Hz)**: Historical average
10. **Power Stability (%)**: Stability percentage

### Outage Data Format

Outages are stored in pipe-separated format:

```
Location | Date Time | Duration | Users | Cause
```

## Configuration

### Environment Variables

- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time
- `NODE_ENV`: Application environment (development/production)

### Database Configuration

- **Provider**: MySQL 8.0
- **ORM**: Prisma
- **Connection Pool**: Automatic management
- **Migrations**: Automatic with `prisma db push`

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: XSS protection
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **CORS Protection**: Next.js built-in

## Testing

### Database Connection Test

```bash
npm run test-db
```

### API Testing

Test the signup API:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}
```
