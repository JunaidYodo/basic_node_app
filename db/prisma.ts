import { PrismaClient } from '@prisma/client';

// Simple function to get DATABASE_URL
const getDatabaseUrl = (): string => {
  // Get values from environment (injected by ECS from Secrets Manager)
  const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  
  // Validate
  if (!DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error('Missing database environment variables');
  }
  
  // For AWS RDS, always use SSL in production
  const ssl = '?sslmode=require';
  
  // Encode password for URL safety
  const encodedPassword = encodeURIComponent(DB_PASSWORD);
  
  return `postgresql://${DB_USERNAME}:${encodedPassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}${ssl}`;
};

// Set for Prisma
process.env.DATABASE_URL = getDatabaseUrl();

// Create Prisma client
const prisma = new PrismaClient();

// Log connection (without password)
console.log('Database connected to:', process.env.DB_HOST);

export default prisma;