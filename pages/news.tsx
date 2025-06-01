import { GetServerSideProps } from "next";
import NewsCarousel from "../components/NewsCarousel";
import { supabase } from "../lib/supabaseClient";

export const getServerSideProps: GetServerSideProps = async () => {
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

export default function News({ articles, error }: any) {
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
