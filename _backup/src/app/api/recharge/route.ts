import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { packId, amount } = body;

        // Mock Razorpay Order Creation
        console.log(`Creating Razorpay order for pack ${packId} - Amount: ${amount}`);

        // Simulate external API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            orderId: `order_${Math.random().toString(36).slice(2, 9)}`,
            amount: amount,
            currency: 'INR',
            keyId: 'rzp_test_mock_12345'
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Payment initialization failed' }, { status: 500 });
    }
}
