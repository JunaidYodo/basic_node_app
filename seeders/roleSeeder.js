import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Administrator with full access to all features'
  },
  {
    id: 2,
    name: 'User',
    description: 'Regular user with limited access'
  }
];

const seedRoles = async () => {
  try {
    // Delete existing roles
    await prisma.roles.deleteMany();
    
    // Insert new roles
    const createdRoles = await prisma.roles.createMany({
      data: roles
    });
    console.log('Roles seeded successfully:', createdRoles);
    
    return createdRoles;
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
};

export default seedRoles; 