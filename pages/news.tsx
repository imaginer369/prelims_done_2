import { GetServerSideProps } from "next";
import NewsCarousel from "../components/NewsCarousel";
import { supabase } from "../lib/supabaseClient";

export const getServerSideProps: GetServerSideProps<NewsProps> = async (context) => {
  // Disable CDN and browser caching for this SSR page
  context.res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, quick_summary, content, image_url, published_at")
    .order("published_at", { ascending: false })
    .range(0, 9);

  return {
    props: {
      articles: articles || [],
      error: error ? error.message : null,
    },
  };
};

// Define the types for articles and error
interface Article {
  id: number;
  title: string;
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
}

interface NewsProps {
  articles: Article[];
  error: string | null;
}

export default function News({ articles, error }: NewsProps) {
  if (error) {
    return <div className="text-red-600">Failed to load articles.</div>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Latest News</h1>
      <NewsCarousel initialArticles={articles} />
    </div>
  );
}
