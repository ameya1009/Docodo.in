
import { PrismaClient } from '@prisma/client';

async function testConnection() {
    const prisma = new PrismaClient();
    try {
        console.log('Testing connection to database...');
        await prisma.$connect();
        console.log('Connection successful!');

        const leadCount = await prisma.lead.count();
        console.log(`Current lead count: ${leadCount}`);

    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
