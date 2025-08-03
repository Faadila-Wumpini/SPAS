# SPAS Backend API

Smart Power Alert System (SPAS) Backend API for real-time electricity monitoring in Ghana.

## 🚀 Features

- **Real-time Power Monitoring** - Track voltage, frequency, and power quality
- **Alert System** - Automated alerts for power issues
- **Outage Management** - Track and manage power outages
- **User Authentication** - Secure user registration and login
- **Analytics** - Power quality trends and regional statistics
- **Notifications** - Email, SMS, and push notifications
- **RESTful API** - Clean, documented endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for production)
- Redis (for caching and real-time features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/spas_db"
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (EmailJS)
EMAILJS_PUBLIC_KEY=your-emailjs-public-key
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout

### Power Monitoring
- `GET /api/power/current` - Get current power readings
- `GET /api/power/history` - Get historical power data
- `GET /api/power/location/:location` - Get readings by location
- `POST /api/power/reading` - Submit new power reading
- `GET /api/power/stats` - Get power statistics

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active` - Get active alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `GET /api/alerts/stats` - Get alert statistics

### Outages
- `GET /api/outages` - Get all outages
- `GET /api/outages/active` - Get active outages
- `POST /api/outages` - Create new outage
- `PUT /api/outages/:id` - Update outage
- `PATCH /api/outages/:id/resolve` - Resolve outage
- `GET /api/outages/stats` - Get outage statistics

### Analytics
- `GET /api/analytics/trends` - Get power quality trends
- `GET /api/analytics/stability` - Get stability metrics
- `GET /api/analytics/regions` - Get regional statistics
- `GET /api/analytics/summary` - Get power quality summary
- `GET /api/analytics/hourly` - Get hourly analysis

### Notifications
- `POST /api/notifications/email` - Send email notification
- `POST /api/notifications/sms` - Send SMS notification
- `POST /api/notifications/push` - Send push notification
- `POST /api/notifications/bulk` - Send bulk notifications
- `POST /api/notifications/alert` - Send alert notification
- `GET /api/notifications/status` - Get notification status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Data Models

### User
```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  region: string,
  city: string,
  phone?: string,
  createdAt: Date
}
```

### Power Reading
```javascript
{
  id: string,
  deviceId: string,
  location: string,
  region: string,
  voltage: number,
  frequency: number,
  current?: number,
  power?: number,
  timestamp: Date
}
```

### Alert
```javascript
{
  id: string,
  type: 'undervoltage' | 'overvoltage' | 'frequency_instability' | 'outage' | 'maintenance',
  severity: 'low' | 'medium' | 'high' | 'critical',
  location: string,
  region: string,
  message: string,
  timestamp: Date,
  resolvedAt?: Date,
  affectedUsers: number
}
```

### Outage
```javascript
{
  id: string,
  location: string,
  region: string,
  startTime: Date,
  estimatedEndTime: Date,
  actualEndTime?: Date,
  cause: string,
  status: 'active' | 'resolved' | 'scheduled',
  affectedUsers: number,
  description?: string
}
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run build` - Build for production

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.js         # Main server file
├── package.json
├── env.example
└── README.md
```

## 🔧 Middleware

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression
- **Morgan** - Request logging
- **Rate Limiting** - API rate limiting
- **JWT Authentication** - Token validation

## 📈 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error handling middleware
- Rate limiting protection

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- Security headers with Helmet
- CORS configuration

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-production-secret
   ```

2. **Install dependencies**
   ```bash
   npm install --production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@spas.com or create an issue in the repository.

---

**SPAS Backend API** - Powering Ghana's electricity monitoring system ⚡ 