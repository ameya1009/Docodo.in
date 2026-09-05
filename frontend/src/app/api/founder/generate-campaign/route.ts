import { NextRequest, NextResponse } from "next/server";
import { isFounderAuthenticated } from "@/lib/founder-auth";
import { DocodoBackendAPI } from "@/lib/api-client";

export const dynamic = "force-dynamic";

const CAMPAIGN_PROMPTS: Record<string, string> = {
  INSTA_REEL_FOUNDER: `You are the lead viral marketing strategist for Docodo.in (an AI booking & growth operating system for Indian salons, spas, clinics, gyms, and local businesses).
Task: Write a high-converting 30-45s Instagram Reel Script to get local salon/clinic/gym owners to sign up on docodo.in.
Format:
1. ⚡ 3s Scroll-Stopping Hook (Visual + Audio) e.g., "If you own a salon in India and still take bookings manually on WhatsApp, you're losing ₹40,000 every month..."
2. 💡 Problem Agitation: Double-bookings, missed calls while attending clients, no automated reminders causing 30% no-shows.
3. 🚀 The Docodo Solution: 24/7 AI WhatsApp Booking, instant UPI payments, 0% commission, and automated reminder alerts.
4. 🎯 Clear CTA: "Link in bio to set up your online store in 15 minutes or DM 'GROWTH' for a free live demo."
5. 🎵 Trending Audio & Visual B-Roll recommendations.`,

  INSTA_CAROUSEL_FOUNDER: `You are the chief content creator for Docodo.in's official Instagram.
Task: Create a 5-Slide educational carousel blueprint designed to attract local business owners.
Format:
- Slide 1: High curiosity title (e.g. "5 Reasons Why Indian Salons & Spas Lose ₹50,000/Month (And The 1-Click Fix)")
- Slide 2: The "Manual WhatsApp" Trap (Why typing messages by hand kills your time)
- Slide 3: The "No-Show" Epidemic (Why automated WhatsApp reminders cut cancellations by 70%)
- Slide 4: Instant UPI & Advance Payments (Why advance deposits eliminate wasted slots)
- Slide 5: The Fix: Set up your automated booking website on Docodo.in in under 15 mins (Link in bio)
Include caption with 10 viral Indian business growth hashtags (#IndianBusiness #SalonOwner #ClinicManagement #Docodo #SmallBusinessIndia).`,

  COLD_WHATSAPP_PITCH: `Write a high-converting, respectful, and personalized cold WhatsApp outreach message from Ameya (Founder of Docodo.in) to a local salon/clinic/gym owner in India.
Key Points:
- Warm greeting addressing the business owner
- Mention we noticed their great customer reviews and want to help them automate appointments & cut no-shows
- 14-day free trial with zero setup fees
- Direct link to test a live demo: docodo.in/demo
- Keep it under 120 words with clean formatting and emojis.`,

  INSTA_COLD_DM: `Write a 3-step high-converting Instagram DM outreach script for Docodo.in sales team messaging local beauty salons, dental clinics, physiotherapists, and fitness trainers.
Step 1: Casual, value-first opener complimenting their work.
Step 2: Mentioning how similar studios in Pune/Mumbai saved 10+ hours/week and stopped no-shows using 24/7 WhatsApp AI booking.
Step 3: Low-friction CTA (e.g., "Would it be okay if I share a 60-second video of how it works for your page?").`,

  GOOGLE_MAPS_OUTREACH: `Write a step-by-step cold outreach script for calling or messaging 4.5+ star rated businesses found on Google Maps that lack a direct booking website.
Format:
1. Identifying the gap (They get Google traffic, but customers leave because there is no 1-click booking link).
2. The Proposition: Adding docodo.in/book/[name] to their Google Business profile to turn map visitors into paying appointments 24/7.
3. Pricing pitch: Flat ₹999/month, zero commission per booking.`,
};

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isFounderAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized access to Founder Suite" }, { status: 401 });
    }

    const body = await request.json();
    const { campaignType = "INSTA_REEL_FOUNDER", targetIndustry = "Salons & Clinics" } = body;

    const basePrompt = CAMPAIGN_PROMPTS[campaignType] || CAMPAIGN_PROMPTS.INSTA_REEL_FOUNDER;
    const prompt = `${basePrompt}\n\nTailor this specifically for target industry: ${targetIndustry}.`;

    const res = await DocodoBackendAPI.generateContent({
      type: "INSTAGRAM",
      prompt,
      industry: targetIndustry,
      name: "Docodo.in",
    });

    return NextResponse.json({
      success: true,
      campaignType,
      targetIndustry,
      content: res.content,
      engine: res.engine,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Campaign generation failed" },
      { status: 500 }
    );
  }
}
