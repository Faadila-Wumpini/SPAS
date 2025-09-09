# SPAS API Documentation

<style>
body { font-size: 12px; }
h1 { font-size: 18px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4 { font-size: 13px; }
p, li { font-size: 11px; }
code { font-size: 10px; }
</style>

## Overview
SPAS (Smart Power Alert System) provides RESTful APIs for authentication and power data monitoring. All APIs return JSON responses and use standard HTTP status codes.

## Base URL
```
http://localhost:3000/api
```

## Authentication APIs

### POST /auth/signup
Register a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Minimum 2 characters
- `email`: Valid email format
- `password`: Minimum 6 characters

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-08-05T20:59:56.915Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `400 Bad Request`: User already exists
- `500 Internal Server Error`: Server errors

---

### POST /auth/login
Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `500 Internal Server Error`: Server errors

---

### POST /auth/logout
Logout current user.

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>` (optional)

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me
Get current user profile.

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>` or cookie

**Response (200 OK):**
```json
{
  "user": {
    "id": "cmdz0w5ql0000ujb0uh5cqrod",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server errors

---

## Power Data APIs

### GET /power-data
Get power data for all regions.

**Endpoint:** `GET /api/power-data`

**Response (200 OK):**
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
    "scheduledOutages": [
      {
        "location": "Area D",
        "startTime": "2025-08-03 14:12",
        "duration": "5h",
        "usersAffected": 628,
        "cause": "Storm damage"
      }
    ],
    "usersAffected": 3342,
    "averageVoltage": 224,
    "averageFrequency": 50.34,
    "powerStability": 79
  }
]
```

**Data Fields:**
- `regionName`: Ghanaian region name
- `liveFrequency`: Current frequency in Hz
- `liveVoltage`: Current voltage in V
- `powerQualityTrend`: Status (Stable/Fluctuating/Dropping)
- `activeOutages`: Array of current outages
- `scheduledOutages`: Array of planned outages
- `usersAffected`: Total affected users
- `averageVoltage`: Historical average voltage
- `averageFrequency`: Historical average frequency
- `powerStability`: Stability percentage (0-100)

---

### GET /power-data/trends
Get historical trends data.

**Endpoint:** `GET /api/power-data/trends`

**Query Parameters:**
- `region` (optional): Specific region name

**Examples:**
```
GET /api/power-data/trends
GET /api/power-data/trends?region=Greater%20Accra
```

**Response (200 OK):**
```json
[
  {
    "time": "14:00",
    "voltage": 224.5,
    "frequency": 50.2,
    "stability": 79.5
  },
  {
    "time": "15:00",
    "voltage": 225.1,
    "frequency": 50.3,
    "stability": 80.2
  }
]
```

**Data Fields:**
- `time`: Time in HH:MM format
- `voltage`: Voltage reading in V
- `frequency`: Frequency reading in Hz
- `stability`: Stability percentage

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message description"
}
```

### Common Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Authentication

### JWT Token Format
Tokens are JWT (JSON Web Tokens) with the following payload:
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Storage
- **HTTP-Only Cookies**: Primary method for web clients
- **Authorization Header**: Alternative method for API clients

### Token Expiration
- **Default**: 7 days
- **Configurable**: Via `JWT_EXPIRES_IN` environment variable

---

## Testing APIs

### Using curl
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test power data
curl http://localhost:3000/api/power-data

# Test trends
curl "http://localhost:3000/api/power-data/trends?region=Greater%20Accra"
```

### Using PowerShell
```powershell
# Test signup
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test power data
Invoke-WebRequest -Uri "http://localhost:3000/api/power-data" -Method GET
```

## New Features (v1.1.0)

### Settings Management
The application now includes a comprehensive settings page accessible at `/settings` where users can:
- Update their profile information
- Manage notification preferences
- Configure display settings
- Update password and security settings

### Outage Tracking
A dedicated outages page is available at `/outages` providing:
- Real-time outage status updates
- Historical outage data
- Regional outage impact analysis
- User-specific outage notifications

### Help & Support
Enhanced help system accessible at `/help` including:
- Frequently asked questions
- Contact forms
- User guides and documentation
- Support ticket system

---

**Last Updated:** January 2025
**Version:** 1.1.0 