import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, source, medium, campaign, quiz_profile } = await req.json();

    console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "OK" : "MISSING");
    console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY ? "OK" : "MISSING");

    const { error } = await supabase.from("signups").insert({
      email,
      source: source ?? null,
      medium: medium ?? null,
      campaign: campaign ?? null,
      quiz_profile: quiz_profile ?? null,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
