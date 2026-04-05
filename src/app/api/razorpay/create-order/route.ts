import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { amount, currency = "INR", receipt = "receipt#1" } = body;

        // amount is sent in minimum currency unit (paise)
        const options = {
            amount: amount,
            currency: currency,
            receipt: receipt,
            notes: {
                userId: (session.user as any).id
            }
        };

        const generateOrder = await razorpay.orders.create(options);
        
        if (!generateOrder) {
            return NextResponse.json({ error: 'Could not generate Razorpay order' }, { status: 500 });
        }

        return NextResponse.json(generateOrder);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
