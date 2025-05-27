// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("article_id");

  if (!articleId) {
    return NextResponse.json(
      { error: "Missing article_id query parameter" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("articles_concepts")
    .select("concepts(id, name, info)")
    .eq("article_id", articleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten the nested array of concepts
  const concepts = data.map((item) => item.concepts);

  return NextResponse.json(concepts);
}
