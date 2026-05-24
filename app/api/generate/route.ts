import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { QuizProfile, Itinerary } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const profile: QuizProfile = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(buildUserPrompt(profile));
    const raw = result.response.text();

    let itinerary: Itinerary;
    try {
      itinerary = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        return Response.json({ error: "Failed to parse itinerary" }, { status: 500 });
      }
      itinerary = JSON.parse(match[0]);
    }

    return Response.json(itinerary);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Generate error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
