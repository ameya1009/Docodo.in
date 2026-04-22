import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, answers } = await req.json();

        if (!email || !answers) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const lead = await prisma.growthGraderLead.create({
            data: {
                email,
                answers,
            },
        });

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        console.error('Growth Grader Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
