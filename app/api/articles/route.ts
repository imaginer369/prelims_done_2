// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Get pagination params from query string
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Fetch paginated articles
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, quick_summary, content, image_url, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const response = NextResponse.json(data);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

