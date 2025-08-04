// Database connection test script
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test if users table exists
    const userCount = await prisma.user.count()
    console.log(`📊 Users table exists with ${userCount} users`)
    
    // Test if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@spas.com' }
    })
    
    if (demoUser) {
      console.log('👤 Demo user found:', demoUser.name)
      console.log('🎯 You can login with: demo@spas.com / password123')
    } else {
      console.log('⚠️  Demo user not found - run database schema first')
    }
    
    console.log('\n✅ Database is ready for authentication!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error:', error.message)
    
    if (error.code === 'P1001') {
      console.log('\n💡 This usually means:')
      console.log('   1. MySQL is not running')
      console.log('   2. Wrong connection string in .env')
      console.log('   3. Database "spas_auth" doesn\'t exist')
      console.log('\n🔧 Try running: npm run setup')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()