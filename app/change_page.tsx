// app/article/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch("/api/articles");
        const articles: Article[] = await res.json();
        // For demonstration, we pick the first article.
        if (articles && articles.length > 0) {
          setArticle(articles[0]);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No article found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Image with 16:9 Aspect Ratio */}
      <div className="w-full">
        <div className="relative w-full aspect-video">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </div>
  );
}

