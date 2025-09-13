import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");

  if (!from_date || !to_date) {
    return new Response(JSON.stringify({ error: "Missing date parameters" }), { status: 400 });
  }

  const { data, error } = await supabase.rpc('get_concepts_by_date', { from_date, to_date });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ concepts: data }), { status: 200 });
}
