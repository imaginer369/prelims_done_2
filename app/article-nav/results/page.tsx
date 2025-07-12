
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import NewsCarousel from "../../../components/NewsCarousel";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Concept {
  id: number;
  name: string;
  info: string;
}

interface Article {
  id: number;
  title: string;
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
  concepts?: Concept[];
}

function ArticleResultsContent() {
  const params = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const query: Record<string, string> = {};
      if (params && params.get("date")) query.date = params.get("date")!;
      if (params && params.get("timeframe")) query.timeframe = params.get("timeframe")!;
      const search = new URLSearchParams(query).toString();
      const res = await fetch(`/api/article-nav?${search}`);
      const data = await res.json();
      // Fetch concepts for each article, just like homepage
      const articlesWithConcepts = await Promise.all(
        (data.articles || []).map(async (article: Article) => {
          const conceptsRes = await fetch(`/api/concepts?article_id=${article.id}`);
          const conceptsData = await conceptsRes.json();
          return { ...article, concepts: Array.isArray(conceptsData) ? conceptsData : [] };
        })
      );
      setArticles(articlesWithConcepts);
      setLoading(false);
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.toString()]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="mt-10 m-0 p-0">
      <NewsCarousel articles={articles} />
    </div>
  );
}

export default function ArticleResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ArticleResultsContent />
    </Suspense>
  );
}
