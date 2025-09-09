# SPAS - Smart Power Alert System

<style>
body { font-size: 12px; }
h1 { font-size: 18px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4 { font-size: 13px; }
p, li { font-size: 11px; }
code { font-size: 10px; }
</style>

A comprehensive power monitoring and alert system for Ghana's power grid, providing real-time data visualization, outage tracking, and user authentication.

## Features

### Authentication System
- User registration and login with JWT
- Password hashing with bcrypt
- Protected routes with middleware
- Session management with HTTP-only cookies
- Custom email/password authentication

### Power Monitoring Dashboard
- Real-time voltage and frequency data
- Regional power quality monitoring
- Historical trends visualization
- Outage tracking and alerts
- Interactive charts with Recharts
- Settings management for user preferences

### Alert System
- Real-time outage notifications
- Power quality warnings
- Regional status indicators
- User impact tracking
- Comprehensive outage tracking page

### User Management
- User settings and profile management
- Help and support system
- Contact and feedback forms

## Architecture

### Frontend
- **Framework**: Next.js 14.2+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 18+
- **Database**: MySQL with Prisma ORM 6.13+
- **Authentication**: JWT with bcrypt
- **API**: Next.js API Routes
- **Validation**: Zod schema validation

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
│   ├── settings/                 # User settings page
│   ├── outages/                  # Outage tracking page
│   ├── trends/                   # Data trends
│   └── help/                     # Help and support
├── components/                    # Reusable UI components
│   ├── ui/                       # Radix UI components
│   ├── navigation.tsx            # Main navigation
│   ├── footer.tsx                # Footer component
│   └── providers.tsx             # Context providers
├── contexts/                     # React Context providers
├── data/                         # Static data files
├── lib/                          # Utility libraries
├── prisma/                       # Database schema
└── public/                       # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get user profile

### Power Data
- `GET /api/power-data` - Get all regions data
- `GET /api/power-data/trends` - Get historical trends

## Quick Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file:
```env
# Database Configuration
DATABASE_URL="mysql://root:password@localhost:3306/spas_auth"

# JWT Configuration
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Test database connection
npm run test-db
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000`

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

### Power Data CSV
The system uses `data/power_data_regions_full.csv` with:
- Region names and live metrics
- Outage information
- Power quality trends
- Historical averages

### Regions Covered
- Greater Accra
- Ashanti
- Western
- Eastern
- Volta
- Northern
- Upper East
- Upper West
- Bono
- Bono East
- Ahafo
- Western North
- Savannah
- North East
- Oti
- Central

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Input validation with Zod
- SQL injection protection
- CORS protection

## Testing

### Database Connection
```bash
npm run test-db
```

### API Testing
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test power data
curl http://localhost:3000/api/power-data
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review setup guides
- Open an issue on GitHub

---

**Built for Ghana's power grid monitoring**
