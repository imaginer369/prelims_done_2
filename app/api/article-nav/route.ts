
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const date = searchParams.get("date");
  const timeframe = searchParams.get("timeframe");

  let query = supabase
    .from('articles')
    .select('id, title, quick_summary, content, image_url, published_at')
    .order('published_at', { ascending: false });

  if (date && !timeframe) {
    query = query
      .gte('published_at', date + 'T00:00:00')
      .lt('published_at', date + 'T23:59:59.999');
  } else if (timeframe && !date) {
    const now = new Date();
    let days = 0;
    if (timeframe.endsWith('d')) days = parseInt(timeframe);
    if (timeframe.endsWith('w')) days = parseInt(timeframe) * 7;
    if (timeframe.endsWith('m')) days = parseInt(timeframe) * 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const cutoffStr = cutoff.toISOString().slice(0, 19).replace('T', ' ');
    query = query.gte('published_at', cutoffStr);
  } else {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const response = NextResponse.json({ articles: data });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
