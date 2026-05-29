import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, template = 'Salon', businessName = 'Premium Salon' } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // If Gemini API is configured
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a friendly, highly professional WhatsApp AI Chatbot Assistant for "${businessName}", a business in the category "${template}" located in Pune, India.
Your goal is to converse with clients, help them book appointments, answer their questions, and qualify them.

CRITICAL INSTRUCTIONS:
- You must reply in "Hinglish" (a smooth blend of Hindi and English, written using English/Latin alphabets. E.g., "Haan ji, humare paas Saturday ko 4 PM ka slot available hai. Booking confirm karu?").
- Mention specific Pune locations if relevant (e.g. Baner, Viman Nagar, Hinjewadi, Koregaon Park, FC Road).
- Keep responses short, concise, and mobile-friendly (max 2-3 lines), typical for WhatsApp chats. Use emojis appropriately.
- Guide the customer towards a direct action (e.g., booking a slot, selecting a service).

Here is the conversation history:
${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`).join('\n')}

Generate the next WhatsApp response:`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text().trim();
      return res.status(200).json({ reply });
    } catch (err) {
      console.error('Gemini error in WhatsApp simulator:', err);
    }
  }

  // Local rule-based chatbot logic (very robust and contextual for Pune)
  const userText = lastUserMessage.toLowerCase();
  let reply = '';

  const locationContext = template === 'Cafe' ? 'Koregaon Park & FC Road' : 'Baner & Viman Nagar';

  if (messages.length === 1) {
    // This is the first user input after greeting
    if (userText.includes('hi') || userText.includes('hello') || userText.includes('hey') || userText.includes('namaste')) {
      reply = `Namaste! 🙏 Welcome to ${businessName}. Main aapki booking aur details me help kar sakta hu. Aapko kya service inquire karni hai? Standard slot ya special package?`;
    } else if (userText.includes('book') || userText.includes('slot') || userText.includes('appointment') || userText.includes('time')) {
      reply = `Haan ji, bilkul! Humare ${locationContext} outlets par slots available hain. Aap kaunse branch me aana chahenge aur kab?`;
    } else {
      reply = `Aapka message mil gaya! Humare ${businessName} me aapko custom options milenge. Kya aap aaj ke timing ke baare me jaan na chahte hain ya special booking karni hai?`;
    }
  } else {
    // Ongoing convo
    if (userText.includes('baner') || userText.includes('viman nagar') || userText.includes('koregaon') || userText.includes('fc road') || userText.includes('branch') || userText.includes('location')) {
      reply = `Sahi choice! 📍 Humare pass aaj shaam 4:30 PM aur kal dopahar 2:00 PM ke slots vacant hain. Kaunsa time perfect rahega aapke liye?`;
    } else if (userText.includes('4') || userText.includes('2') || userText.includes('time') || userText.includes('today') || userText.includes('tomorrow') || userText.includes('shaam') || userText.includes('pm') || userText.includes('am')) {
      reply = `Done deal! 👍 Main aapka slot temporary lock kar deta hu. Please mujhe aapka Full Name aur Number bata dijiye taaki OTP aur booking details direct WhatsApp par bhej saku.`;
    } else if (userText.includes('price') || userText.includes('cost') || userText.includes('charge') || userText.includes('offer') || userText.includes('rate') || userText.includes('discount')) {
      if (template === 'Salon') {
        reply = `Hair Spa ₹999 se start hai aur Premium Haircut ₹599. Plus we have 20% flat discount today for new customers! Should I book a package for you?`;
      } else if (template === 'Clinic') {
        reply = `Basic dermatologist consultation start hota hai ₹499 se (including skin scan). Standard treatments depend on criteria. Appoinment book karu?`;
      } else if (template === 'Cafe') {
        reply = `Humare combo packs start at just ₹299! Espresso + Sourdough Pizza at ₹399 only. High Street Baner outlet pe offer live hai!`;
      } else {
        reply = `Humare basic plans start hote hain ₹1,499 se. We have special introductory discounts also! Booking confirm karein details ke saath?`;
      }
    } else if (/\d{10}/.test(userText) || userText.includes('@') || userText.length > 5 && !userText.includes('no')) {
      // Looks like a name or phone number
      reply = `Awesome! 🚀 Booking request locked! Humare executive directly aapko WhatsApp confirm call karenge in 5 mins. Ek free growth guide gift ke taur par aapke WhatsApp par send kar di hai! Have a great day ahead!`;
    } else {
      reply = `Acha, standard booking complete karne ke liye bas mujhe local location (Baner/Viman Nagar) aur timing confirm kar dijiye. I will handle the rest instantly! ✨`;
    }
  }

  return res.status(200).json({ reply });
}
