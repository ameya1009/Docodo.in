import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/knowledge';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Fallback responses based on common questions
function getFallbackResponse(userMessage: string): string | null {
    const lowerMessage = userMessage.toLowerCase();

    // Services
    if (lowerMessage.includes('service') || lowerMessage.includes('what do') || lowerMessage.includes('what does')) {
        return `Docodo offers 5 main services: Website Design & Development (₹8,000+), AI Marketing Automation (₹4,000-12,000/month), Google Business & Local SEO (₹5,000), WhatsApp Business Automation (₹3,000), and AI Tools & Agents (₹4,999+). We also have packages: Docodo Starter (₹15,000) and Docodo Growth (₹9,999/month). How can I help you with any of these?`;
    }

    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
        return `Our pricing ranges from ₹3,000 for WhatsApp automation to ₹15,000 for our Starter Package. Our Growth Package is ₹9,999/month and includes a full website, AI content automation, social media management, and WhatsApp automation. What specific service interests you?`;
    }

    // Contact/Founder
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('ameya')) {
        return `You can reach out through our contact form, or connect with our founder Ameya Kshirsagar on LinkedIn. He's hands-on with every project and responds quickly. Would you like to schedule a free growth audit?`;
    }

    // Generic greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey')) {
        return `Hello! I'm the Docodo AI Assistant. I can help you learn about our website development, AI automation, and digital growth services. What would you like to know?`;
    }

    return null;
}

export async function POST(request: Request) {
    console.log('--- Chat API Called ---');

    try {
        const { messages } = await request.json();
        console.log('Received messages:', messages?.length || 0);

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error('Invalid messages format');
            return NextResponse.json(
                { error: 'Invalid request: messages array required' },
                { status: 400 }
            );
        }

        // Get the last user message
        const lastUserMessage = messages[messages.length - 1];
        console.log('User question:', lastUserMessage.content);

        // Try fallback first for instant responses
        const fallbackResponse = getFallbackResponse(lastUserMessage.content);
        if (fallbackResponse) {
            console.log('Using fallback response');
            return NextResponse.json({ message: fallbackResponse });
        }

        // Try Gemini API if API key is configured
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            console.error('API key missing');
            return NextResponse.json({
                message: "I'm here to help with questions about Docodo's services, pricing, and digital growth solutions. Try asking: 'What services do you offer?' or 'What are your prices?'"
            });
        }

        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-pro-latest',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            });

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
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            console.log('Gemini response received');
            return NextResponse.json({ message: text });
        } catch (apiError: unknown) {
            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown Gemini API error';
            console.error('Gemini API error, using fallback:', errorMessage);
            return NextResponse.json({
                message: "I can help you with questions about Docodo's services. We offer website development, AI marketing automation, SEO, and more. What would you like to know about our services or pricing?"
            });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Chat API Error:', errorMessage);
        return NextResponse.json(
            {
                error: 'Failed to generate response. Please try again.',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
