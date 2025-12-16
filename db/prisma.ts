import { PrismaClient } from '@prisma/client';

// Dynamically create DATABASE_URL from ECS secrets
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

const prisma = new PrismaClient();

export default prisma;
