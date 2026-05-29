import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { targetProspect, offer, channel = 'WhatsApp', language = 'English' } = req.body;
  if (!targetProspect || !offer) {
    return res.status(400).json({ error: 'Target prospect and offer details are required' });
  }

  // If Gemini API is configured
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a world-class cold outreach copywriter specializing in high-converting B2B outreach scripts for small businesses in India.
Write a cold outreach message based on these parameters:
- Target Prospect: "${targetProspect}"
- Value Proposition / Offer: "${offer}"
- Outreach Channel: "${channel}" (e.g., WhatsApp, Email, Instagram DM)
- Language: "${language}" (if Hinglish, write in hybrid Hindi-English using Latin/English characters)

Make the copy feel premium, empathetic, results-driven, and highly conversational. Keep it brief. For WhatsApp, avoid long paragraphs; use line breaks, bold key words, and bullet points. Use standard copywriting frameworks like AIDA (Attention, Interest, Desire, Action).

Format the output EXACTLY as a JSON object with two keys:
{
  "subject": "Subject line (leave empty if WhatsApp or DM)",
  "body": "Outreach body text goes here..."
}
Return only valid JSON. No markdown wrappers.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJSON);
      return res.status(200).json(parsed);
    } catch (err) {
      console.error('Gemini error in outreach writer, falling back:', err);
    }
  }

  // Local templates (extremely detailed, verified local-to-global angles)
  const isHinglish = language.toLowerCase() === 'hinglish';
  const isEmail = channel.toLowerCase() === 'cold email' || channel.toLowerCase() === 'email';
  
  let subject = '';
  let body = '';

  if (isEmail) {
    if (isHinglish) {
      subject = `Quick question regarding ${targetProspect} growth (Pune maps)`;
      body = `Hi Team,\n\nI was looking at Viman Nagar business listings, aur dekha ki aapki rating 4.8+ hai. Par click-to-book functionality missing lag rahi thi.\n\nHumne Pune ke local brands ke liye ek custom AI booking bot setup kiya hai jo automatically ${offer} generate karta hai with zero extra ad spend.\n\nKoregaon Park me ek salon ne isse run kiya and they got 24 new bookings in first 10 days.\n\nKya hum is Thursday ko ek quick 5-min call par connect kar sakte hain to share the live mockup?\n\nCheers,\nGrowth Team\nDocodo.in`;
    } else {
      subject = `Partnering with ${targetProspect} to double bookings`;
      body = `Hi Team,\n\nI recently came across your brand while researching high-performing local services in Pune. You have a stellar reputation, but there seems to be a major leak in the online booking flow.\n\nWe build AI-first growth systems that help brands like yours implement an automated booking & qualification loop. Our core offer: ${offer}.\n\nWe recently helped an enterprise in Baner secure 38 additional high-ticket bookings in just 2 weeks.\n\nWould you be open to a brief, 5-minute audit call this Friday to see the mockup we created for your business?\n\nBest regards,\nAmeya Kshirsagar\nFounder, Docodo.in`;
    }
  } else {
    // WhatsApp or DM (No subject, use emojis and bold text)
    if (isHinglish) {
      body = `Namaste! 🙏 Quick note for the owner of *${targetProspect}*.\n\nMain Pune maps par local businesses analyze kar raha tha. I noticed a small gap in your automated WhatsApp flow.\n\nHumne Pune brands ke liye ek AI Chatbot banaya hai jo automatically leads call back aur *${offer}* book kar leta hai.\n\nBaner branch ke ek clinic ne isse use kiya & they got *₹68,400 extra bookings* in a week.\n\nKya main aapke brand ke liye ek *Free Live Demo Mockup* WhatsApp par bhej sakta hu? Just reply *YES* to review.`;
    } else {
      body = `Hello! 👋 Quick question for the decision-maker at *${targetProspect}*.\n\nI noticed your business online and saw you have amazing reviews! However, your website is missing a direct automated WhatsApp booking loop.\n\nWe help local Pune businesses implement AI bots that automatically qualify leads and secure *${offer}* on autopilot.\n\nWe just helped a local cafe scale their weekday orders by 40% using this exact flow.\n\nCould I send you a *Free 3-minute video demo* of how this would look for your brand? Reply *DEMO* to get it.`;
    }
  }

  return res.status(200).json({ subject, body });
}
