import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    console.log('--- Contact Form API Called ---');
    console.log('Request origin:', request.headers.get('origin'));
    console.log('Request method:', request.method);

    try {
        const body = await request.json();
        console.log('Incoming body:', JSON.stringify(body, null, 2));
        const { name, business, email, budget, goal, message } = body;

        // Basic Server-side Validation
        if (!name || !email || !business || !budget) {
            console.log('Validation failed: Missing fields');
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Validation failed: Invalid email');
            return NextResponse.json(
                { success: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        console.log('Attempting to save lead to database...');
        // Save Lead to Database via Prisma
        try {
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
            console.log('Lead saved successfully:', lead.id);

            return NextResponse.json({
                success: true,
                message: 'Growth audit requested successfully',
                leadId: lead.id
            }, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (dbError: any) {
            console.error('Prisma Create Error:', dbError);
            return NextResponse.json(
                { success: false, message: `Database error: ${dbError.message}` },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Global API Error:', error);
        return NextResponse.json(
            { success: false, message: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
}

