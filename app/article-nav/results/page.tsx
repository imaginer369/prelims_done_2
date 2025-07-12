"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
// import styles from "../article-nav.module.css"; // CSS file removed

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
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
      if (params && params.get("category")) query.category = params.get("category")!;
      const search = new URLSearchParams(query).toString();
      const res = await fetch(`/api/articles?${search}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setLoading(false);
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.toString()]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Articles</h1>
      {loading ? (
        <div>Loading...</div>
      ) : articles.length === 0 ? (
        <div>No articles found for the selected options.</div>
      ) : (
        <div className="space-y-6">
          {articles.map(article => (
            <div key={article.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
              <div className="flex justify-between text-xs mb-2 text-gray-500 dark:text-gray-400">
                <span>{article.category}</span>
                <span>{article.date}</span>
              </div>
              <h2 className="text-lg font-semibold mb-1 text-blue-800 dark:text-blue-200">{article.title}</h2>
              <p className="text-gray-700 dark:text-gray-200">{article.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArticleResultsPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-slate-900 rounded-lg shadow"><div>Loading...</div></div>}>
      <ArticleResultsContent />
    </Suspense>
  );
}
