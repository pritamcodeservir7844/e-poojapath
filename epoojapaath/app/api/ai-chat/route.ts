import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a warm spiritual assistant for ePoojapaath — India's online puja booking and temple discovery platform.
You help devotees with:
- Temple queries (temples in specific cities)
- Puja information (what is Rudrabhishek, Satyanarayan Katha, etc.)
- Chadawa offerings
- Booking guidance
- Hindu philosophy, festivals, mantras, and rituals
- Astrology basics (rashifal, panchang, muhurat)

Keep responses concise, warm, and devotional. Use 🙏 emoji occasionally. Respond in English or Hindi based on user's query language.
Business contact: +91 98765 43210 | support@epoojapaath.com | 12, Assi Ghat Road, Varanasi, UP 221005`;

const FALLBACK_RESPONSES: Record<string, string> = {
  puja:       "🙏 ePoojapaath offers 100+ sacred pujas including Rudrabhishek, Satyanarayan Katha, Navgrah Puja, Lakshmi Puja, and more. Visit /puja to browse all available rituals.",
  chadawa:    "🌸 Chadawa is the divine offering of flowers, sweets, and sacred items to deities. You can offer Chadawa at any temple through ePoojapaath and it will be presented by temple pandits on your behalf.",
  book:       "📿 To book a puja: 1) Browse temples at /temples, 2) Select a puja, 3) Fill your Sankalp and devotee details, 4) Pay securely via Razorpay, 5) Receive confirmation and live stream link.",
  temple:     "🛕 We have 500+ temples registered across 50+ cities in India. Visit /temples to search by city, deity, or puja type.",
  panchang:   "🔮 Use our free Panchang Calculator at /astro to check today's Tithi, Nakshatra, Rahu Kaal, and Abhijit Muhurat.",
  contact:    "📞 You can reach us at +91 98765 43210 or support@epoojapaath.com | Office: 12, Assi Ghat Road, Varanasi, UP 221005 | Mon–Sat, 9 AM – 6 PM IST",
  default:    "🙏 I'm your spiritual guide on ePoojapaath. You can ask me about temples, pujas, chadawa, astrology tools, booking process, or Hindu festivals. How may I assist you?",
};

function getFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("puja") || lower.includes("pooja"))       return FALLBACK_RESPONSES.puja;
  if (lower.includes("chadawa") || lower.includes("chaddha"))  return FALLBACK_RESPONSES.chadawa;
  if (lower.includes("book") || lower.includes("booking"))     return FALLBACK_RESPONSES.book;
  if (lower.includes("temple") || lower.includes("mandir"))    return FALLBACK_RESPONSES.temple;
  if (lower.includes("panchang") || lower.includes("tithi"))   return FALLBACK_RESPONSES.panchang;
  if (lower.includes("contact") || lower.includes("phone"))    return FALLBACK_RESPONSES.contact;
  return FALLBACK_RESPONSES.default;
}

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

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
        system: SYSTEM_PROMPT,
        messages: msgs,
      });
      const reply = response.content[0].type === "text" ? response.content[0].text : getFallbackReply(message);
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json({ reply: getFallbackReply(message) });
    }
  }

  return NextResponse.json({ reply: getFallbackReply(message) });
}
