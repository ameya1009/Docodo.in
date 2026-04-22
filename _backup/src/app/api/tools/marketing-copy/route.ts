import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { product, valueProp } = await req.json();
        if (!product || !valueProp) {
           return NextResponse.json({ error: 'Please provide both product and value proposition' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
             return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        const COST = 2; // 2 credits

        if (user.credits < COST) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = `Act as an expert Marketing Copywriter. Generate engaging social media copy (e.g., for LinkedIn and Twitter) and a short ad copy for the following product:
        Product Name/Description: ${product}
        Value Proposition: ${valueProp}
        Make sure the output includes appropriate hashtags and emojis. Provide the output in plain text.`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Log usage & deduct
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { credits: { decrement: COST } }
            }),
            prisma.toolUsage.create({
                data: {
                    userId: user.id,
                    toolName: 'Marketing Copy',
                    creditsUsed: COST
                }
            })
        ]);

        return NextResponse.json({ result: text, newCredits: user.credits - COST });

    } catch (error: any) {
        console.error('Marketing Copy Tool error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate' }, { status: 500 });
    }
}
