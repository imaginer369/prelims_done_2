// app/page.tsx
import { supabase } from "../lib/supabaseClient";
import NewsCarousel from "../components/NewsCarousel";

export default async function HomePage() {
  // SSR: Fetch only the first 10 articles for initial render (progressive loading handled client-side)
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, quick_summary, content, image_url, published_at")
    .order("published_at", { ascending: false })
    .range(0, 9); // Only fetch first 10 articles for SSR

  // Handle possible fetch error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load articles. Please try again later.
      </div>
    );
  }

  // Fetch concepts for each article and attach as concepts property
  const articlesWithConcepts = await Promise.all(
    (articles || []).map(async (article) => {
      const { data: conceptsData } = await supabase
        .from("articles_concepts")
        .select("concepts(id, name, info)")
        .eq("article_id", article.id);
      // Flatten and filter nulls
      let concepts = (conceptsData || [])
        .map((item) => item.concepts)
        .filter(Boolean)
        .flat();
      return { ...article, concepts };
    })
  );

  // Pass articles as prop to NewsCarousel (progressive loading will fetch more on client)
  return (
    <div className="mt-10 m-0 p-0 ">
      <NewsCarousel initialArticles={articlesWithConcepts} />
    </div>
  );
}

