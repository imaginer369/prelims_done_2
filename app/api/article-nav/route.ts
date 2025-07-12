import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

// /api/article-nav GET endpoint for Article Nav filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const timeframe = searchParams.get("timeframe");
  // const category = searchParams.get("category");
  let query = supabase
    .from('articles')
    .select('id, title, quick_summary, content, image_url, published_at')
    .order('published_at', { ascending: false });

  // Only one of date or timeframe should be used for filtering
  if (date && !timeframe) {
    query = query.gte('published_at', date + 'T00:00:00').lt('published_at', date + 'T23:59:59.999');
  } else if (timeframe && !date) {
    // Parse timeframe (e.g., 2d, 1w, 1m)
    const now = new Date();
    let days = 0;
    if (timeframe.endsWith('d')) days = parseInt(timeframe);
    if (timeframe.endsWith('w')) days = parseInt(timeframe) * 7;
    if (timeframe.endsWith('m')) days = parseInt(timeframe) * 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    // Format cutoff to 'YYYY-MM-DD HH:MM:SS' (no milliseconds, no Z)
    const cutoffStr = cutoff.toISOString().slice(0, 19).replace('T', ' ');
    query = query.gte('published_at', cutoffStr);
  }
  // Category filter removed (no category column yet)

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const response = NextResponse.json({ articles: data });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
