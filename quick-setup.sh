#!/bin/bash

echo "🚀 SPAS Authentication System Setup"
echo "=================================="

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "📦 Docker found! Setting up MySQL with Docker..."
    
    # Check if container already exists
    if docker ps -a | grep -q spas-mysql; then
        echo "🔄 Stopping existing MySQL container..."
        docker stop spas-mysql 2>/dev/null
        docker rm spas-mysql 2>/dev/null
    fi
    
    # Start MySQL container
    echo "🚀 Starting MySQL container..."
    docker run --name spas-mysql \
        -e MYSQL_ROOT_PASSWORD=password123 \
        -e MYSQL_DATABASE=spas_auth \
        -p 3306:3306 \
        -d mysql:8.0
    
    # Wait for MySQL to start
    echo "⏳ Waiting for MySQL to start (15 seconds)..."
    sleep 15
    
    # Run database schema
    echo "📊 Creating database schema..."
    docker exec -i spas-mysql mysql -u root -ppassword123 spas_auth < database-schema.sql
    
    # Update .env file for Docker setup
    echo "⚙️  Updating .env file..."
    cat > .env << EOL
# Database Configuration (Docker MySQL)
DATABASE_URL="mysql://root:password123@localhost:3306/spas_auth"

# JWT Configuration
JWT_SECRET="super-secure-jwt-secret-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
EOL
    
    echo "✅ Docker MySQL setup complete!"
    
else
    echo "❗ Docker not found. Please install MySQL manually:"
    echo ""
    echo "macOS: brew install mysql && brew services start mysql"
    echo "Ubuntu: sudo apt install mysql-server"
    echo ""
    echo "Then run:"
    echo "mysql -u root -p -e 'CREATE DATABASE spas_auth;'"
    echo "mysql -u root -p spas_auth < database-schema.sql"
    echo ""
    echo "And update DATABASE_URL in .env file with your MySQL password"
fi

# Test database connection
echo ""
echo "🔍 Testing database connection..."
if npm run --silent test-db 2>/dev/null; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check the setup."
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Visit: http://localhost:3000/auth/signup"
echo "3. Create your account and test login"
echo ""
echo "Demo account available:"
echo "Email: demo@spas.com"
echo "Password: password123"