import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAppStats } from "@/services/temple.service";

const getSystemPrompt = (templeCount: number, cityCount: number, pujaCount: number) => `You are a warm spiritual assistant for ePoojapaath — India's online puja booking and temple discovery platform.
You help devotees with:
- Temple queries (temples in specific cities)
- Puja information (what is Rudrabhishek, Satyanarayan Katha, etc.)
- Chadawa offerings
- Booking guidance
- Hindu philosophy, festivals, mantras, and rituals
- Astrology basics (rashifal, panchang, muhurat)

Current Platform Stats: We have ${templeCount > 0 ? templeCount + '+' : "many"} temples registered across ${cityCount > 0 ? cityCount + '+' : "several"} cities in India, offering ${pujaCount > 0 ? pujaCount + '+' : "numerous"} sacred pujas.

Keep responses concise, warm, and devotional. Use 🙏 emoji occasionally. Respond in English or Hindi based on user's query language.
Business contact: +91 91650 57755 | support@epoojapaath.com | Dhaleswar, Agartala, West Tripura, Pin – 799007`;

const getFallbackResponses = (templeCount: number, cityCount: number, pujaCount: number): Record<string, string> => ({
  puja:       `🙏 ePoojapaath offers ${pujaCount > 0 ? pujaCount + '+' : "100+"} sacred pujas including Rudrabhishek, Satyanarayan Katha, Navgrah Puja, Lakshmi Puja, and more. Visit /puja to browse all available rituals.`,
  chadawa:    "🌸 Chadawa is the divine offering of flowers, sweets, and sacred items to deities. You can offer Chadawa at any temple through ePoojapaath and it will be presented by temple pandits on your behalf.",
  book:       "📿 To book a puja: 1) Browse temples at /temples, 2) Select a puja, 3) Fill your Sankalp and devotee details, 4) Pay securely via Razorpay, 5) Receive confirmation and live stream link.",
  temple:     `🛕 We have ${templeCount > 0 ? templeCount + '+' : "many"} temples registered across ${cityCount > 0 ? cityCount + '+' : "several"} cities in India. Visit /temples to search by city, deity, or puja type.`,
  panchang:   "🔮 Use our free Panchang Calculator at /astro to check today's Tithi, Nakshatra, Rahu Kaal, and Abhijit Muhurat.",
  contact:    "📞 You can reach us at +91 91650 57755 or support@epoojapaath.com | Office: Dhaleswar, Agartala, West Tripura, Pin – 799007 | Mon–Sat, 10 AM – 6 PM",
  default:    "🙏 I'm your spiritual guide on ePoojapaath. You can ask me about temples, pujas, chadawa, astrology tools, booking process, or Hindu festivals. How may I assist you?",
});

function getFallbackReply(message: string, templeCount: number, cityCount: number, pujaCount: number): string {
  const lower = message.toLowerCase();
  const responses = getFallbackResponses(templeCount, cityCount, pujaCount);
  if (lower.includes("puja") || lower.includes("pooja"))       return responses.puja;
  if (lower.includes("chadawa") || lower.includes("chaddha"))  return responses.chadawa;
  if (lower.includes("book") || lower.includes("booking"))     return responses.book;
  if (lower.includes("temple") || lower.includes("mandir"))    return responses.temple;
  if (lower.includes("panchang") || lower.includes("tithi"))   return responses.panchang;
  if (lower.includes("contact") || lower.includes("phone"))    return responses.contact;
  return responses.default;
}

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

  let templeCount = 500;
  let cityCount = 50;
  let pujaCount = 100;
  try {
    const stats = await getAppStats();
    templeCount = stats.templeCount;
    cityCount = stats.cityCount;
    pujaCount = stats.pujaCount;
  } catch (error) {
    console.error("Failed to fetch app stats:", error);
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const msgs = [
        ...history.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ];
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: getSystemPrompt(templeCount, cityCount, pujaCount),
        messages: msgs,
      });
      const reply = response.content[0].type === "text" ? response.content[0].text : getFallbackReply(message, templeCount, cityCount, pujaCount);
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json({ reply: getFallbackReply(message, templeCount, cityCount, pujaCount) });
    }
  }

  return NextResponse.json({ reply: getFallbackReply(message, templeCount, cityCount, pujaCount) });
}
