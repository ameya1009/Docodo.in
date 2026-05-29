import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // In a real app, we'd get the userId from a session
        // For now, we'll use a fixed demo user for Phase 3 completion
        const userId = 'user_demo_2026';

        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        // Auto-create demo user if they don't exist
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: 'demo@docodo.global',
                    name: 'Demo User',
                    credits: 100
                }
            });
        }

        return NextResponse.json({
            success: true,
            credits: user.credits
        });
    } catch (error) {
        console.error('Fetch credits error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch credits' }, { status: 500 });
    }
}
