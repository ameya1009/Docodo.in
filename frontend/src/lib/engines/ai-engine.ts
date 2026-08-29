/**
 * Docodo Multi-Provider Round-Robin & Fallback AI Engine
 * Inspired by Pain Panacea: Zero-cost AI assistant with key pooling, rate-limit cooldowns,
 * multilingual Indian local dialect support (English/Hindi/Marathi/Hinglish), and intent routing.
 */

export interface AIProviderConfig {
  name: "GROQ" | "GEMINI" | "OPENROUTER" | "CEREBRAS";
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface BusinessContext {
  businessName: string;
  industry: string;
  address?: string | null;
  city?: string | null;
  services: Array<{ name: string; price: number; duration: number; description?: string | null }>;
  workingHours: Array<{ day: string; openTime: string; closeTime: string; isOpen: boolean }>;
  knowledgeBase?: Array<{ question: string; answer: string; category: string }>;
  bookingSlug: string;
}

// In-memory key cooldown registry
const keyCooldowns = new Map<string, number>();

/**
 * Extracts available API keys from environment variables and key pools
 */
export function getAvailableAIProviders(): AIProviderConfig[] {
  const providers: AIProviderConfig[] = [];
  const now = Date.now();

  const isCooledDown = (key: string) => {
    const until = keyCooldowns.get(key) || 0;
    return now > until;
  };

  // 1. Groq Keys
  const groqKeys = [
    process.env.GROQ_API_KEY,
    ...(process.env.GROQ_API_KEYS ? process.env.GROQ_API_KEYS.split(",") : []),
  ]
    .filter(Boolean)
    .map((k) => k!.trim())
    .filter(isCooledDown);

  for (const key of groqKeys) {
    providers.push({
      name: "GROQ",
      apiKey: key,
      model: "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    });
  }

  // 2. Google Gemini Keys
  const geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_AI_API_KEY,
    ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(",") : []),
  ]
    .filter(Boolean)
    .map((k) => k!.trim())
    .filter(isCooledDown);

  for (const key of geminiKeys) {
    providers.push({
      name: "GEMINI",
      apiKey: key,
      model: "gemini-2.5-flash",
      baseUrl: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    });
  }

  // 3. OpenRouter Keys
  const openRouterKeys = [
    process.env.OPENROUTER_API_KEY,
    ...(process.env.OPENROUTER_API_KEYS ? process.env.OPENROUTER_API_KEYS.split(",") : []),
  ]
    .filter(Boolean)
    .map((k) => k!.trim())
    .filter(isCooledDown);

  for (const key of openRouterKeys) {
    providers.push({
      name: "OPENROUTER",
      apiKey: key,
      model: "meta-llama/llama-3.3-70b-instruct:free",
      baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    });
  }

  // 4. Cerebras Keys
  const cerebrasKeys = [
    process.env.CEREBRAS_API_KEY,
    ...(process.env.CEREBRAS_API_KEYS ? process.env.CEREBRAS_API_KEYS.split(",") : []),
  ]
    .filter(Boolean)
    .map((k) => k!.trim())
    .filter(isCooledDown);

  for (const key of cerebrasKeys) {
    providers.push({
      name: "CEREBRAS",
      apiKey: key,
      model: "llama3.1-70b",
      baseUrl: "https://api.cerebras.ai/v1/chat/completions",
    });
  }

  return providers;
}

/**
 * Marks an API key into a 60-second cooldown when rate-limited (HTTP 429)
 */
function markKeyCooldown(key: string) {
  keyCooldowns.set(key, Date.now() + 60_000);
}

/**
 * Builds standard localized prompt for Indian service businesses
 */
function buildSystemPrompt(context: BusinessContext): string {
  const serviceList = context.services
    .map((s) => `- ${s.name}: ₹${s.price} (${s.duration} mins) ${s.description ? `(${s.description})` : ""}`)
    .join("\n");

  const hoursList = context.workingHours
    .map((h) => `${h.day}: ${h.isOpen ? `${h.openTime} - ${h.closeTime}` : "Closed"}`)
    .join(", ");

  const kbList = (context.knowledgeBase || [])
    .map((k) => `Q: ${k.question}\nA: ${k.answer}`)
    .join("\n\n");

  return `You are the friendly, professional, and efficient WhatsApp AI Assistant for "${context.businessName}", an Indian ${context.industry} business located at ${context.address || context.city || "India"}.

BUSINESS DETAILS:
- Name: ${context.businessName}
- Working Hours: ${hoursList}
- Services & Pricing:
${serviceList}
- Booking Link: https://www.docodo.in/book/${context.bookingSlug}

${kbList ? `KNOWLEDGE BASE / FREQUENTLY ASKED QUESTIONS:\n${kbList}\n` : ""}

CORE INSTRUCTIONS & BEHAVIOR:
1. Language & Tone: Auto-detect the customer's language. Reply in the same language and tone: English, Hindi (Devanagari or Romanized), Marathi, or natural Hinglish.
2. WhatsApp Formatting: Keep replies concise (2-4 sentences maximum). Use bold *text* and bullet points.
3. Booking: When customers want to book an appointment, warmly guide them to pick a service, preferred date, and time, or share the direct link (https://www.docodo.in/book/${context.bookingSlug}).
4. Non-Medical/Non-Clinical Safety Guardrail: If this is a clinic/healthcare business, NEVER diagnose conditions or prescribe medications. Provide clinic information, fees, timings, and advise booking a consultation with the doctor.
5. Emergency Hand-off: If a customer mentions extreme emergencies or pain, immediately advise emergency medical care or hospital visit.
6. Human Hand-off: If a customer asks to "speak to a human", "talk to receptionist", or "talk to doctor", acknowledge politely and assure them a staff member will reply shortly.`;
}

/**
 * Executes multi-provider round-robin completion with automatic fallback
 */
export async function generateAIResponse(
  userMessage: string,
  context: BusinessContext,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<{ text: string; providerUsed: string }> {
  const providers = getAvailableAIProviders();
  const systemPrompt = buildSystemPrompt(context);

  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory.slice(-4),
    { role: "user", content: userMessage },
  ];

  // Try each configured provider in order
  for (const provider of providers) {
    try {
      if (provider.name === "GROQ" || provider.name === "OPENROUTER" || provider.name === "CEREBRAS") {
        const res = await fetch(provider.baseUrl!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            temperature: 0.6,
            max_tokens: 300,
          }),
        });

        if (res.status === 429) {
          console.warn(`[AI Engine] ${provider.name} rate-limited (429). Cooldown initiated.`);
          markKeyCooldown(provider.apiKey);
          continue;
        }

        if (!res.ok) {
          console.warn(`[AI Engine] ${provider.name} failed with status ${res.status}`);
          continue;
        }

        const json = await res.json();
        const text = json.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { text, providerUsed: provider.name };
        }
      } else if (provider.name === "GEMINI") {
        const contents = [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nCustomer Message: ${userMessage}` }] },
        ];

        const res = await fetch(provider.baseUrl!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
          }),
        });

        if (res.status === 429) {
          console.warn(`[AI Engine] Gemini rate-limited (429). Cooldown initiated.`);
          markKeyCooldown(provider.apiKey);
          continue;
        }

        if (!res.ok) {
          console.warn(`[AI Engine] Gemini failed with status ${res.status}`);
          continue;
        }

        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { text, providerUsed: "GEMINI" };
        }
      }
    } catch (err) {
      console.warn(`[AI Engine] Provider ${provider.name} threw error, falling back:`, err);
    }
  }

  // Fallback heuristic generator when all external LLMs are rate-limited or unconfigured
  return {
    text: generateHeuristicReply(userMessage, context),
    providerUsed: "HEURISTIC_FALLBACK",
  };
}

/**
 * Intelligent localized fallback responder (0-cost, 100% uptime guarantee)
 */
function generateHeuristicReply(userMessage: string, context: BusinessContext): string {
  const lower = userMessage.toLowerCase();

  // 1. Timings & Hours
  if (lower.includes("time") || lower.includes("open") || lower.includes("close") || lower.includes("kab") || lower.includes("samay")) {
    const openDays = context.workingHours.filter((h) => h.isOpen);
    const timings = openDays.map((h) => `${h.day} (${h.openTime}-${h.closeTime})`).join(", ");
    return `Namaste! 🙏 *${context.businessName}* is open: ${timings || "Mon-Sat 9:00 AM - 7:00 PM"}.\n\nYou can book your visit online here: https://www.docodo.in/book/${context.bookingSlug}`;
  }

  // 2. Services & Price / Fees
  if (lower.includes("price") || lower.includes("fee") || lower.includes("cost") || lower.includes("rate") || lower.includes("kitna") || lower.includes("charges")) {
    const topServices = context.services.slice(0, 3).map((s) => `• *${s.name}*: ₹${s.price}`).join("\n");
    return `Here are our popular services at *${context.businessName}*:\n\n${topServices || "Check our full menu online"}\n\n👉 Book your preferred slot: https://www.docodo.in/book/${context.bookingSlug}`;
  }

  // 3. Location / Address
  if (lower.includes("location") || lower.includes("address") || lower.includes("kahan") || lower.includes("where")) {
    return `📍 *${context.businessName}* is located at: ${context.address || context.city || "Docodo Partner Clinic/Salon"}.\n\nNeed an appointment? Book online in 1 click: https://www.docodo.in/book/${context.bookingSlug}`;
  }

  // 4. Human / Doctor / Staff request
  if (lower.includes("human") || lower.includes("doctor") || lower.includes("staff") || lower.includes("reception") || lower.includes("baat")) {
    return `Sure! Our staff at *${context.businessName}* has been notified and will reply to you shortly. 🙏\n\nIf urgent, you can also book directly: https://www.docodo.in/book/${context.bookingSlug}`;
  }

  // 5. Default Greeting & Guided Booking
  return `Hello! Welcome to *${context.businessName}*! 😊\n\nHow can I help you today? You can ask about our *services*, *timings*, *pricing*, or book an appointment directly:\n👉 https://www.docodo.in/book/${context.bookingSlug}`;
}
