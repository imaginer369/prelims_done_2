import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  const articleId = segments[segments.length - 1];
  if (!articleId) {
    return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
  }

  // Fetch the article
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('id, title, content, image_url, published_at')
    .eq('id', articleId)
    .single();

  if (articleError || !article) {
    return NextResponse.json({ error: articleError?.message || 'Article not found' }, { status: 404 });
  }

  // Fetch related concepts
  const { data: conceptsData, error: conceptsError } = await supabase
    .from('articles_concepts')
    .select('concepts(id, name, info)')
    .eq('article_id', articleId);

  if (conceptsError) {
    return NextResponse.json({ error: conceptsError.message }, { status: 500 });
  }

  // Flatten the nested array of concepts
  const concepts = conceptsData
    .map((item) => item.concepts)
    .filter(Boolean);
  const flatConcepts = Array.isArray(concepts[0]) ? concepts.flat().filter(Boolean) : concepts;

  return NextResponse.json({ ...article, concepts: flatConcepts });
}
