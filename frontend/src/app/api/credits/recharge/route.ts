import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, packId } = body;
        const userId = 'user_demo_2026'; // Fixed demo user

        // Determine credits based on packId (Sync with pricing/page.tsx)
        let credits = 0;
        if (packId === 'p1') credits = 100;
        else if (packId === 'p2') credits = 500;
        else if (packId === 'p3') credits = 2000;

        // In production, initialize Razorpay/Stripe session here.
        // For Phase 3, we initialize a PENDING transaction in Prisma.

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: amount,
                credits: credits,
                status: 'PENDING',
                razorpayId: 'rzp_pending_' + Math.random().toString(36).substr(2, 9)
            }
        });

        console.log(`[REAL] Created PENDING transaction ${transaction.id} for user ${userId}`);

        return NextResponse.json({
            success: true,
            orderId: transaction.razorpayId,
            transactionId: transaction.id,
            message: 'Payment session initialized'
        });
    } catch (error) {
        console.error('Recharge initialization error:', error);
        return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
    }
}
