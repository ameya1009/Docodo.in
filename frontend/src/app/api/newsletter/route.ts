import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Try to create the subscriber
        // Prisma will throw an error if the email already exists due to the @unique constraint
        try {
            await prisma.newsletter.create({
                data: { email },
            });
        } catch (dbError: unknown) {
            // Check if it's a unique constraint violation (P2002)
            if (typeof dbError === 'object' && dbError !== null && 'code' in dbError && (dbError as { code: string }).code === 'P2002') {
                return NextResponse.json({
                    success: true,
                    message: 'You are already subscribed!',
                });
            }
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
        });
    } catch (error: unknown) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { success: false, message: 'We encountered an error. Please try again later.' },
            { status: 500 }
        );
    }
}
