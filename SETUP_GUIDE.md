# SPAS Setup Guide

<style>
body { font-size: 12px; }
h1 { font-size: 18px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }
h4 { font-size: 13px; }
p, li { font-size: 11px; }
code { font-size: 10px; }
</style>

## Prerequisites
- Node.js 18+ (recommended: 18.17+)
- MySQL 8.0+
- npm, pnpm, or yarn

## Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd SPAS
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/spas_auth"

# JWT Configuration
JWT_SECRET="super-secure-jwt-secret-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"

# EmailJS Configuration (Optional)
EMAILJS_SERVICE_ID="your-service-id"
EMAILJS_TEMPLATE_ID="your-template-id"
EMAILJS_PUBLIC_KEY="your-public-key"
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

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Docker Setup (Alternative)

For easy setup with Docker:

```bash
# Run the quick setup script
./quick-setup.sh

# Or manually with Docker
docker run --name spas-mysql \
  -e MYSQL_ROOT_PASSWORD=password123 \
  -e MYSQL_DATABASE=spas_auth \
  -p 3306:3306 \
  -d mysql:8.0
```

## Manual MySQL Setup

### 1. Install MySQL
- **Windows**: Download from MySQL website
- **macOS**: `brew install mysql`
- **Ubuntu**: `sudo apt install mysql-server`

### 2. Start MySQL Service
```bash
# Windows
net start mysql80

# macOS
brew services start mysql

# Ubuntu
sudo systemctl start mysql
```

### 3. Create Database
```bash
mysql -u root -p
CREATE DATABASE spas_auth;
EXIT;
```

### 4. Update .env File
Update the DATABASE_URL with your MySQL password:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/spas_auth"
```

## Testing the Setup

### 1. Test Database Connection
```bash
npm run test-db
```

Expected output:
```
Testing database connection...
Database connected successfully!
Users table exists with 0 users
Database is ready for authentication!
```

### 2. Test API Endpoints
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test power data
curl http://localhost:3000/api/power-data
```

### 3. Test Web Interface
1. Visit `http://localhost:3000`
2. Navigate to `/auth/signup`
3. Create a test account
4. Test login functionality

## Troubleshooting

### Database Connection Issues
- **Error**: `P1001: Can't reach database server`
  - **Solution**: Ensure MySQL is running
  - **Command**: `net start mysql80` (Windows) or `brew services start mysql` (macOS)

- **Error**: `P1002: Authentication failed`
  - **Solution**: Check DATABASE_URL in .env file
  - **Verify**: MySQL username and password

### Port Issues
- **Error**: `Port 3000 is in use`
  - **Solution**: Next.js will automatically use port 3001
  - **Access**: `http://localhost:3001`

### Prisma Issues
- **Error**: `Prisma Client not generated`
  - **Solution**: Run `npx prisma generate`
  - **Then**: Restart the development server

### Environment Variables
- **Error**: `DATABASE_URL is not set`
  - **Solution**: Create `.env` file with required variables
  - **Verify**: File is in project root directory

## Production Setup

### 1. Environment Variables
Update `.env` for production:
```env
DATABASE_URL="mysql://username:password@host:3306/spas_auth"
JWT_SECRET="your-production-secret-key"
NODE_ENV="production"
```

### 2. Build Application
```bash
npm run build
npm start
```

### 3. Database Migrations
```bash
npx prisma migrate deploy
```

## Security Considerations

### 1. JWT Secret
- Use a strong, random secret
- Change from default in production
- Store securely (not in version control)

### 2. Database Security
- Use strong passwords
- Limit database user permissions
- Enable SSL connections

### 3. Environment Variables
- Never commit `.env` files
- Use different secrets for development/production
- Rotate secrets regularly

## Performance Optimization

### 1. Database
- Add indexes for frequently queried fields
- Use connection pooling
- Monitor query performance

### 2. Application
- Enable Next.js caching
- Optimize images and assets
- Use CDN for static files

## Monitoring and Logging

### 1. Application Logs
- Check console output for errors
- Monitor API response times
- Track user authentication attempts

### 2. Database Monitoring
- Monitor connection pool usage
- Track slow queries
- Monitor disk space

## Backup and Recovery

### 1. Database Backup
```bash
mysqldump -u root -p spas_auth > backup.sql
```

### 2. Application Backup
- Backup source code
- Backup environment variables
- Backup database schema

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs
3. Test with minimal setup
4. Open an issue on GitHub

---

**Last Updated:** January 2025
**Version:** 1.1.0 