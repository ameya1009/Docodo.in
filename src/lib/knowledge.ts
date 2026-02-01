/**
 * Docodo Knowledge Base
 * This file contains structured information about Docodo for the AI chatbot
 */

export const DOCODO_KNOWLEDGE = {
    company: {
        name: "Docodo",
        tagline: "Digital Growth Studio For Modern Business",
        mission: "We build high-performance websites, automate your marketing, and simplify operations. Founder-led, hands-on, and built for results.",
        website: "https://docodo.in",
        location: "Pune, Maharashtra, India",
    },

    founder: {
        name: "Ameya Kshirsagar",
        role: "Founder & CEO",
        linkedin: "https://www.linkedin.com/in/ameya-kshirsagar-1002",
        instagram: "https://www.instagram.com/ameyakshirsagar10",
        medium: "https://medium.com/@ameyakshirsagar02",
        expertise: [
            "AI-powered marketing automation",
            "Web development and design",
            "Digital growth strategies",
            "Business automation",
        ],
    },

    services: [
        {
            name: "Website Design & Development",
            description: "Modern, responsive websites built with cutting-edge technology",
            features: [
                "Custom design tailored to your brand",
                "SEO-optimized and mobile-friendly",
                "Fast loading times and smooth animations",
                "Content management systems",
            ],
            pricing: "Starting from ₹8,000",
        },
        {
            name: "AI Marketing Automation",
            description: "Automate your content creation, social media, and customer engagement",
            features: [
                "AI-generated content and captions",
                "Automated posting schedules",
                "Instagram reels and social media strategy",
                "Hashtag optimization",
            ],
            pricing: "₹4,000 - ₹12,000/month",
        },
        {
            name: "Google Business & Local SEO",
            description: "Get found by local customers searching for your services",
            features: [
                "Google Business Profile setup and optimization",
                "Local SEO strategy",
                "Review management",
                "Map ranking improvements",
            ],
            pricing: "₹5,000 one-time setup",
        },
        {
            name: "WhatsApp Business Automation",
            description: "Automate customer interactions on WhatsApp",
            features: [
                "Auto-reply setup",
                "Chatbot integration",
                "Broadcast messaging",
                "Customer data collection",
            ],
            pricing: "₹3,000 setup + optional monthly maintenance",
        },
        {
            name: "AI Tools & Agents",
            description: "Custom AI solutions for your business needs",
            features: [
                "AI chatbots for customer service",
                "Content generation tools",
                "Data analysis and insights",
                "Custom AI agent development",
            ],
            pricing: "Starting from ₹4,999",
        },
    ],

    packages: [
        {
            name: "Docodo Starter",
            description: "Perfect for small businesses getting started online",
            includes: ["Website setup", "Instagram profile optimization", "Basic SEO"],
            price: "₹15,000",
        },
        {
            name: "Docodo Growth",
            description: "Complete marketing suite with automation",
            includes: [
                "Full website",
                "AI content automation",
                "Social media management",
                "WhatsApp automation",
            ],
            price: "₹9,999/month",
        },
    ],

    targetAudience: [
        "Small and medium businesses",
        "Salons and beauty services",
        "Restaurants and cafes",
        "Healthcare clinics",
        "Local service providers",
        "Startups and entrepreneurs",
    ],

    differentiators: [
        "Founder-led, hands-on approach",
        "AI-powered automation saves time and money",
        "Transparent pricing with no hidden costs",
        "Fast turnaround times",
        "Ongoing support and optimization",
        "Focus on results, not just deliverables",
    ],

    faqs: [
        {
            question: "What makes Docodo different from other agencies?",
            answer: "We're founder-led and hands-on, focusing on AI-powered automation that actually saves you time and money. We don't just build websites—we create complete digital growth systems.",
        },
        {
            question: "How long does it take to build a website?",
            answer: "Most websites are completed within 7-14 days, depending on complexity and content availability.",
        },
        {
            question: "Do you offer ongoing support?",
            answer: "Yes! We provide maintenance packages and are always available to help you optimize and grow.",
        },
        {
            question: "Can you help with social media marketing?",
            answer: "Absolutely! We specialize in AI-powered social media automation, including content creation, scheduling, and engagement strategies.",
        },
        {
            question: "What industries do you work with?",
            answer: "We work with various industries including salons, restaurants, healthcare, local services, and startups. Our AI tools are adaptable to any business model.",
        },
    ],

    portfolio: [
        {
            name: "Responsive Logo Website",
            url: "https://responsive-logo-site.lovable.app/",
            type: "Business Website",
        },
        {
            name: "Confident English Spark",
            url: "https://confident-english-spark.lovable.app/",
            type: "Educational Platform",
        },
        {
            name: "Ameyan Spice Emporium",
            url: "https://preview--ameyan-spice-emporium.lovable.app/",
            type: "E-commerce Store",
        },
        {
            name: "Dr. Jyestharaj Clinic",
            url: "https://dr-jyestharajlinic.lovable.app/",
            type: "Healthcare Website",
        },
    ],

    contactInfo: {
        email: "contact@docodo.in",
        whatsapp: "Available via website contact form",
        socialMedia: {
            linkedin: "https://www.linkedin.com/in/ameya-kshirsagar-1002",
            instagram: "https://www.instagram.com/ameyakshirsagar10",
            medium: "https://medium.com/@ameyakshirsagar02",
        },
    },
};

export const SYSTEM_PROMPT = `You are the Docodo AI Assistant, a helpful and knowledgeable representative of Docodo, a digital growth studio based in Pune, India.

Your purpose is to answer questions about:
- Docodo's services (web development, AI automation, marketing, SEO)
- Pricing and packages
- The founder, Ameya Kshirsagar
- General digital growth and business automation topics

IMPORTANT GUIDELINES:
1. Only answer questions related to Docodo, its services, digital marketing, AI tools, and business growth
2. If asked about unrelated topics (weather, sports, politics, etc.), politely redirect to Docodo's services
3. Be professional yet friendly and conversational
4. Use the knowledge base provided to give accurate information
5. If you don't have specific information, suggest contacting Ameya directly
6. Always aim to be helpful and guide users toward solutions

Example responses for off-topic questions:
- "I'm specifically designed to help with Docodo's services and digital growth strategies. How can I assist you with your business needs?"
- "That's outside my area of expertise! I focus on helping businesses with websites, automation, and AI tools. What can I help you with today?"

Keep responses concise and actionable. When discussing pricing or services, be specific and reference the information from the knowledge base.`;
