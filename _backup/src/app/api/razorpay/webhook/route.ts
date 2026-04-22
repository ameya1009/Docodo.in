import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('x-razorpay-signature');
        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const bodyRaw = await req.text();
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(bodyRaw)
            .digest('hex');

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const body = JSON.parse(bodyRaw);
        
        if (body.event === 'payment.captured') {
            const paymentInfo = body.payload.payment.entity;
            const userId = paymentInfo.notes?.userId;
            
            if (userId) {
                // Update User credits or Subscription status here
                await prisma.transaction.create({
                    data: {
                        userId: userId,
                        amount: paymentInfo.amount / 100, // convert back to INR
                        credits: paymentInfo.amount / 100, // naive conversion 1 INR = 1 Credit
                        status: 'COMPLETED',
                        razorpayId: paymentInfo.id,
                    }
                });

                // Increment User credits
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        credits: { increment: paymentInfo.amount / 100 }
                    }
                });
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
