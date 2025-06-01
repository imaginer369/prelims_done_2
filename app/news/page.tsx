// app/news/page.tsx
export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabaseClient";
import NewsCarousel from "@/components/NewsCarousel";

export default async function News() {
  // Server-side fetch from Supabase
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, quick_summary, content, image_url, published_at")
    .order("published_at", { ascending: false })
    .range(0, 9);

  if (error) {
    return <div className="text-red-600">Failed to load articles.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Latest News</h1>
      {/* NewsCarousel will receive fresh articles as server-rendered props */}
      <NewsCarousel initialArticles={articles || []} />
    </div>
  );
}

