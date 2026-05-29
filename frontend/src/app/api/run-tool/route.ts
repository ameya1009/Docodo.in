import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { toolId, credits } = body;
        const userId = 'user_demo_2026'; // Fixed demo user

        // 1. Check user credit balance
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.credits < credits) {
            return NextResponse.json({
                success: false,
                error: 'Insufficient credits',
                required: credits,
                current: user?.credits || 0
            }, { status: 403 });
        }

        // 2. Perform transaction (Atomic update)
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { credits: { decrement: credits } }
            }),
            prisma.toolUsage.create({
                data: {
                    userId,
                    toolName: toolId,
                    creditsUsed: credits
                }
            })
        ]);

        console.log(`[REAL] Running tool ${toolId} - Deducted ${credits} credits for ${userId}`);

        // Simulate tool processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

        return NextResponse.json({
            success: true,
            toolId,
            creditsDeducted: credits,
            newBalance: updatedUser?.credits,
            result: `Successfully ran ${toolId} agent. Balance: ${updatedUser?.credits} cr.`
        });
    } catch (error) {
        console.error('Tool execution error:', error);
        return NextResponse.json({ success: false, error: 'Tool execution failed' }, { status: 500 });
    }
}
