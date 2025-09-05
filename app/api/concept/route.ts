import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conceptId = searchParams.get("id");

  if (!conceptId) {
    return NextResponse.json(
      { error: "Missing id query parameter" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, info")
    .eq("id", conceptId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? [data] : []);
}
