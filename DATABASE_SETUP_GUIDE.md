# MySQL Database Setup Guide for SPAS

## Prerequisites

### Install MySQL (if not already installed)

**macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**Windows:**
Download and install from: https://dev.mysql.com/downloads/installer/

## Step-by-Step Setup

### 1. Start MySQL Service

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Windows:**
MySQL should start automatically after installation.

### 2. Access MySQL Command Line

Open terminal and run:
```bash
mysql -u root -p
```

If you haven't set a root password yet:
```bash
mysql -u root
```

### 3. Create Database and User

Once in MySQL prompt (mysql>), run these commands:

```sql
-- Create the database
CREATE DATABASE spas_auth;

-- Create a user for the application (optional but recommended)
CREATE USER 'spas_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON spas_auth.* TO 'spas_user'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Switch to the database
USE spas_auth;

-- Exit MySQL
EXIT;
```

### 4. Run the Schema File

From your project directory, run:
```bash
mysql -u root -p spas_auth < database-schema.sql
```

Or if using the created user:
```bash
mysql -u spas_user -p spas_auth < database-schema.sql
```

### 5. Verify Database Creation

Log back into MySQL and check:
```bash
mysql -u root -p spas_auth
```

In MySQL prompt:
```sql
-- Show tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;

-- Check if demo user exists
SELECT id, name, email, created_at FROM users;
```

You should see:
- A `users` table
- A demo user with email `demo@spas.com`

## Environment Configuration

Update your `.env` file with your MySQL credentials:

```env
# If using root user (not recommended for production)
DATABASE_URL="mysql://root:your_root_password@localhost:3306/spas_auth"

# If using created user (recommended)
DATABASE_URL="mysql://spas_user:your_secure_password@localhost:3306/spas_auth"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

## Alternative Setup Methods

### Option A: Using MySQL Workbench (GUI)

1. Download MySQL Workbench from: https://dev.mysql.com/downloads/workbench/
2. Connect to your MySQL server
3. Create new schema called `spas_auth`
4. Open and execute the `database-schema.sql` file

### Option B: Using phpMyAdmin (Web Interface)

1. Install phpMyAdmin or use XAMPP/MAMP
2. Access phpMyAdmin in browser
3. Create database `spas_auth`
4. Import the `database-schema.sql` file

### Option C: Using Docker (if you prefer containers)

```bash
# Run MySQL in Docker
docker run --name spas-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=spas_auth \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for container to start, then run schema
docker exec -i spas-mysql mysql -u root -prootpassword spas_auth < database-schema.sql
```

## Troubleshooting

### Common Issues:

**"mysql: command not found"**
- MySQL is not installed or not in PATH
- Install MySQL or add to PATH

**"Access denied for user 'root'"**
- Wrong password or root user doesn't exist
- Reset MySQL root password or create user

**"Can't connect to MySQL server"**
- MySQL service is not running
- Start MySQL service

**"Database doesn't exist"**
- Run the CREATE DATABASE command first

### Reset MySQL Root Password (if needed):

**macOS:**
```bash
sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables &
mysql -u root
```

**Linux:**
```bash
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
mysql -u root
```

Then in MySQL:
```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

## Testing the Setup

After database setup, test with Prisma:

```bash
# Generate Prisma client
npx prisma generate

# Test database connection
npx prisma db pull

# (Optional) Push schema changes
npx prisma db push
```

## Production Notes

1. **Never use root user in production**
2. **Use strong passwords**
3. **Enable SSL connections**
4. **Regular database backups**
5. **Monitor database performance**

Your database is now ready for the SPAS authentication system!