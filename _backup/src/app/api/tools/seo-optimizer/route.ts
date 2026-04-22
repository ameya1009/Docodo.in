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

        const { description } = await req.json();
        if (!description) {
           return NextResponse.json({ error: 'Please provide context or a description' }, { status: 400 });
        }

        // We use email to fetch the exact user since session.user.id might not be mapped properly if they just signed in via weird methods. 
        // We ensure we get the updated credits from DB.
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        
        if (!user) {
             return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        const COST = 2; // 2 credits

        if (user.credits < COST) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const prompt = `Act as an expert SEO Optimizer. Given the following context: "${description}", generate a highly optimized Meta Title, Meta Description, and a list of 5 target Keywords. Format out exact ONLY as a JSON string without markdown blocks, e.g. { "title": "...", "description": "...", "keywords": ["...", "..."] }`;
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        if(text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '');
        else if(text.startsWith('```')) text = text.replace(/```/g, '');
        
        let parsedResult;
        try {
            parsedResult = JSON.parse(text);
        } catch(e) {
            parsedResult = { result: text }; // fallback
        }

        // Log usage & deduct
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { credits: { decrement: COST } }
            }),
            prisma.toolUsage.create({
                data: {
                    userId: user.id,
                    toolName: 'SEO Optimizer',
                    creditsUsed: COST
                }
            })
        ]);

        return NextResponse.json({ result: parsedResult, newCredits: user.credits - COST });

    } catch (error: any) {
        console.error('SEO Optimizer Tool error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate' }, { status: 500 });
    }
}
