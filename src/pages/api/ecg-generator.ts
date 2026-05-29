import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, language = 'English', industry = 'General' } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // If Gemini API key is configured, use it
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemPrompt = `You are a world-class copywriter specializing in the "ECG Content Formula" popularized by Raj Shamani.
The formula stands for:
- E (Evergreen, 50% ratio): Timeless, highly educational content that builds authority, solves problems, and builds trust.
- C (Controversial, 30% ratio): Bold, thought-provoking statements, challenging the status quo, and driving engagement.
- G (Growth, 20% ratio): Direct response, promotion, low-friction offer, or CTA that brings immediate results/leads.

Generate social media content for a business in the "${industry}" industry, based on this prompt: "${prompt}".
Create the content in the "${language}" language (if Hinglish, write in a hybrid of English and Hindi using Latin/English characters).

Format the output EXACTLY as a JSON object with three keys:
{
  "evergreen": "Evergreen content goes here...",
  "controversial": "Controversial content goes here...",
  "growth": "Growth content goes here..."
}
Return only valid JSON. No markdown wrappers.`;

      const result = await model.generateContent(systemPrompt);
      const text = result.response.text().trim();
      
      // Clean up markdown block if present
      const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJSON);
      return res.status(200).json(parsed);
    } catch (err) {
      console.error('Gemini error in ecg-generator, falling back:', err);
    }
  }

  // Fallback / local template-based generation (extremely detailed)
  const isHinglish = language.toLowerCase() === 'hinglish';
  const isHindi = language.toLowerCase() === 'hindi';

  let evergreen = '';
  let controversial = '';
  let growth = '';

  const cleanPrompt = prompt.toLowerCase();

  if (cleanPrompt.includes('salon') || cleanPrompt.includes('hair') || cleanPrompt.includes('beauty')) {
    if (isHinglish) {
      evergreen = `💇‍♀️ Timeless Hair Care Tip: Saffron water rinse naturally strengthens your roots and adds that rich festive shine. Perfect for Pune's humid monsoon and dry winters alike! Hydration starts from within, so drink 3L water daily.\n\n#PuneSalon #HealthyHairTips #DocodoAI`;
      controversial = `🚫 Bold Truth: Stop wasting money on ₹5000 keratin treatments every 3 months! They are just temporary plastic coating that weakens hair bonds. What you actually need is a customized scalp detox and a clean sulfate-free regime. Don't let standard salons trick you.\n\n#HairTruths #PuneBeauty #SmartConsumer`;
      growth = `🔥 Quick booking alert! Viman Nagar and Baner branch limits slots to just 5 premium VIP hair makeovers this weekend. DM us 'GLOW' now to claim a FREE scalp analysis + 20% off your hair spa.\n\n#PuneSalons #LimitedOffer #PuneLocal`;
    } else if (isHindi) {
      evergreen = `💇‍♀️ सदाबहार हेयर केयर टिप: केसर के पानी से बालों को धोना आपके बालों की जड़ों को मजबूत करता है और प्राकृतिक चमक लाता है। अपने बालों को अंदर से हाइड्रेटेड रखने के लिए रोजाना 3 लीटर पानी पिएं।\n\n#HairCareTips #HindiCopywriter #Docodo`;
      controversial = `🚫 कड़वा सच: हर 3 महीने में ₹5000 के केराटिन ट्रीटमेंट पर पैसे बर्बाद करना बंद करें! ये सिर्फ बालों को कुछ समय के लिए सीधा करते हैं पर जड़ों को नुकसान पहुंचाते हैं। आपको असल में एक प्राकृतिक स्कैल्प डिटॉक्स की जरूरत है।\n\n#BeautyMyths #Exposed #DocodoAI`;
      growth = `🔥 स्पेशल वीकेंड ऑफर! विमान नगर और बानेर की हमारी शाखाओं में केवल 5 स्लॉट बचे हैं। अभी 'GLOW' टाइप करके मैसेज करें और पाएं मुफ्त स्कैल्प एनालिसिस और 20% की फ्लैट छूट।\n\n#PuneOffers #HairSpa #PuneLocal`;
    } else {
      evergreen = `💇‍♀️ Timeless Hair Care Rule: Scalp hydration is the absolute key to preventing hair fall. Use cold-pressed rosemary and coconut oil once a week, massage for 10 minutes, and wash with lukewarm water. Consistency beats complex chemical products every single time.\n\n#HairCareTips #EvergreenContent #HealthyHair`;
      controversial = `🚫 The Hair Industry is Lying to You: Those expensive "salon-exclusive" protein masks are 90% water and silicones. They coat your hair to make it feel smooth for 2 days but suffocate the hair shaft. True hair strength comes from amino acids, iron levels, and pure botanical therapy.\n\n#SalonSecrets #HairEducation #ConsumerAwareness`;
      growth = `🔥 Pune hair makeover alert! We are booking spots for our Premium Scalp Detox + Custom Haircut package for this Saturday. Only 4 slots left at our Koregaon Park studio. Click the link to claim a FREE professional scalp biopsy scan worth ₹1,500!\n\n#PuneSalon #ExclusiveOffer #LocalToGlobal`;
    }
  } else if (cleanPrompt.includes('cafe') || cleanPrompt.includes('food') || cleanPrompt.includes('coffee') || cleanPrompt.includes('restaurant')) {
    if (isHinglish) {
      evergreen = `☕ Brewing Secret: Cold brew making relies entirely on time, not temperature. Steeping roasted Arabica beans in cold water for 18 hours extracts the smooth notes and leaves behind the acidic bitterness. That's how you get clean caffeine energy!\n\n#CoffeeEducation #PuneCafe #BrewingScience`;
      controversial = `🚫 unpopular opinion: "Authentic" Italian wood-fired pizza is overhyped. Half of the time it is burnt, unevenly cooked, and gets cold in 5 minutes. A modern high-deck stone oven gives a much more consistent, crisp, and flavor-locked crust that stays hot.\n\n#FoodDebate #PuneFoodies #CafeOwnerSecrets`;
      growth = `🍕 Treat your squad! This Wednesday, order any of our Signature Pizzas at our FC Road Cafe and get an Artisanal Cold Brew absolutely FREE. Just show this post to your server to redeem!\n\n#PuneOffers #FCRoad #PuneEats`;
    } else {
      evergreen = `☕ The Art of Coffee: The golden rule of perfect coffee is the water-to-coffee ratio. For the best filter coffee, use a 1:16 ratio of medium-ground beans to fresh filtered water heated to 93°C. It unlocks floral notes without burning the flavor.\n\n#CoffeeGuides #BaristaSecrets #Evergreen`;
      controversial = `🚫 Stop Drinking Latte for Weight Loss: Adding flavored syrup and whole milk to double espresso cancels out all coffee antioxidants. If you want true health benefits, switch to clean Americanos or organic matcha. Your daily morning 400-calorie sugar cup is slowing your metabolism.\n\n#HealthTips #CoffeeFacts #CleanEating`;
      growth = `🍕 Mid-week boost! Get a FREE Artisanal Espresso Shake with any Sourdough Pizza order today at our Baner and Koregaon Park cafes. Valid till 6 PM. Click below to secure your table now.\n\n#PuneCafes #MidweekMotivation #PuneFoodies`;
    }
  } else if (cleanPrompt.includes('clinic') || cleanPrompt.includes('skin') || cleanPrompt.includes('doctor') || cleanPrompt.includes('health')) {
    if (isHinglish) {
      evergreen = `🧴 Daily Skincare Rule: Vitamin C serum should always be applied in the morning under your SPF. Vitamin C acts as an antioxidant shield, boosting your sunscreen's protection against pollution and harsh UV rays. Never skip the SPF!\n\n#SkinCareScience #PuneSkinClinic #HealthySkin`;
      controversial = `🚫 Truth Alert: Stop buying DIY chemical peels online! Using 30% AHA or salicylic peel bottles at home without clinical supervision destroys your skin barrier, leading to permanent hyperpigmentation and scarring. Some skincare trends are dangerous.\n\n#SkinSafety #DermatologyFacts #PuneClinic`;
      growth = `✨ Clear Skin Diagnostic: Get a professional 3D Visia Skin Analysis + customized dermatologist consult for just ₹499 this week (Normal price ₹2,500). Limited to first 12 callers. Click to book at our Viman Nagar branch.\n\n#PuneDermatologist #SkinCareClinic #VimanNagar`;
    } else {
      evergreen = `🧴 Dermatologist Golden Rule: Sunscreen is non-negotiable, even when indoors or on cloudy days. UVA rays penetrate glass and clouds, causing 80% of premature skin aging, fine lines, and dark spots. Apply two-finger lengths of SPF 50 every morning.\n\n#SkinCareTruths #DermatologyLife #HealthySkin`;
      controversial = `🚫 The Hyaluronic Acid Hoax: Most hyaluronic acid serums actually dehydrate your skin if you live in a dry climate. They pull moisture from the deep layers of your skin and evaporate it into the dry air. You need a rich occlusive ceramide moisturizer to lock it in.\n\n#SkincareExposed #DermatologySecrets #AntiAging`;
      growth = `✨ Achieve Your Skin Goals: Book our signature Hydradermabrasion facial today and get a complimentary customized skin barrier treatment worth ₹1,200. Slots available for Thursday and Friday in Baner. Click here to claim.\n\n#PuneClinic #SkincareOffer #BanerClinic`;
    }
  } else {
    // General business copy
    if (isHinglish) {
      evergreen = `📈 SMB Growth Rule: customer retention is 5x cheaper than acquiring new customers. Implementing a simple automated WhatsApp loyalty program keeps your clients coming back without ad spend.\n\n#BusinessStrategy #GrowthHacks #PuneBusiness`;
      controversial = `🚫 Hard Truth: Most local businesses don't need a fancy ₹50,000 agency website. They just need a hyper-fast 1-page landing page, a verified Google Maps listing, and an automated booking bot. Stop wasting money on custom code you can't edit.\n\n#SMBMarketing #PuneStartups #TechTalk`;
      growth = `🚀 Boost your revenue! Docodo is offering a FREE 50-point Growth Audit for 10 Pune businesses this month. We will find exactly where you are losing customers. DM us 'AUDIT' to claim yours.\n\n#DocodoAI #BusinessGrowth #PuneLocal`;
    } else {
      evergreen = `📈 The Law of Customer Value: Businesses grow by increasing either customer frequency, transaction value, or customer acquisition. The easiest lever is frequency: keep in touch with existing clients via smart, low-friction automated messaging.\n\n#BusinessGrowth #MarketingStrategy #EvergreenTips`;
      controversial = `🚫 Stop Running Meta Ads: If your business doesn't have an automated follow-up system, you are throwing 80% of your ad budget in the trash. Leaky funnels cannot be fixed by higher traffic. Build your automated WhatsApp database first, run ads second.\n\n#MarketingTruths #SaaSGrowth #LeadNurturing`;
      growth = `🚀 Double your bookings! Get our 100% automated WhatsApp Booking & Review Agent free for 14 days. Watch it qualify leads and book appointments while you sleep. Click below to install with 1-click.\n\n#WhatsAppAutomation #SaaSIndia #DocodoOS`;
    }
  }

  return res.status(200).json({ evergreen, controversial, growth });
}
