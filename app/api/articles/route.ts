// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Get query params
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const date = searchParams.get("date");

  let query = supabase
    .from('articles')
    .select('id, title, quick_summary, content, image_url, published_at')
    .order('published_at', { ascending: false });

  // If a date is provided, filter by published_at (date only, ignoring time)
  if (date) {
    // published_at is assumed to be in ISO format (e.g., 2025-06-29T12:00:00Z)
    // We want all articles where published_at is on the same day as 'date'
    query = query.gte('published_at', date + 'T00:00:00').lt('published_at', date + 'T23:59:59.999');
  } else {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const response = NextResponse.json(data);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

