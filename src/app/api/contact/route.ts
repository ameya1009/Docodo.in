import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, business, email, budget, goal, message } = body;

        // Basic Server-side Validation
        if (!name || !email || !business || !budget) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
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

        // Save Lead to Database via Prisma
        const lead = await prisma.lead.create({
            data: {
                name,
                business,
                email,
                budget,
                goal,
                message: message || '',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Growth audit requested successfully',
            leadId: lead.id
        });
    } catch (error) {
        console.error('Database submission error:', error);
        return NextResponse.json(
            { success: false, message: 'We encountered an error securing your request. Please try again or email us directly.' },
            { status: 500 }
        );
    }
}

