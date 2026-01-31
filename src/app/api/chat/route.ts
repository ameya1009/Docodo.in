import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { DOCODO_KNOWLEDGE, SYSTEM_PROMPT } from '@/lib/knowledge';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid request: messages array required' },
                { status: 400 }
            );
        }

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            console.error('API key missing');
            return NextResponse.json(
                { error: 'API key not configured. Please set GOOGLE_GEMINI_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        // Get the Gemini model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        });

        // Get only the last user message to keep context small
        const lastUserMessage = messages[messages.length - 1];

        // Create a concise prompt
        const prompt = `${SYSTEM_PROMPT}

COMPANY INFO:
- Name: Docodo
- Location: Pune, India
- Services: Website Design (₹8,000+), AI Marketing (₹4,000-12,000/month), Google SEO (₹5,000), WhatsApp Automation (₹3,000), AI Tools (₹4,999+)
- Founder: Ameya Kshirsagar
- Packages: Starter (₹15,000), Growth (₹9,999/month)

USER QUESTION: ${lastUserMessage.content}

RESPOND AS THE DOCODO AI ASSISTANT (2-3 sentences max):`;

        console.log('Sending request to Gemini...');

        // Generate response
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log('Gemini response received:', text.substring(0, 100));

        return NextResponse.json({ message: text });
    } catch (error: any) {
        console.error('Chat API Error Details:', {
            message: error?.message,
            status: error?.status,
            statusText: error?.statusText,
            name: error?.name
        });

        return NextResponse.json(
            {
                error: 'Failed to generate response. Please try again.',
                details: error?.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
