"use client";
import { useState } from "react";
import NewsCarousel from "../components/NewsCarousel";

interface Article {
  id: number;
  title: string;
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
}

export default function ArticlesByDate() {
  const [date, setDate] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchArticlesByDate(selectedDate: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/articles?date=${selectedDate}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data: Article[] = await res.json();
      setArticles(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
    if (e.target.value) {
      fetchArticlesByDate(e.target.value);
    } else {
      setArticles([]);
    }
  }

  return (
    <div className="relative min-h-[80vh] max-w-3xl mx-auto px-2 py-8 sm:py-12 flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 mt-4 mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 w-full px-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-1 tracking-tight drop-shadow">Browse Articles by Date</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Select a date to see all articles published on that day.</p>
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-300 text-xl pointer-events-none peer-focus:text-blue-600 transition-all">
            📅
          </span>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="peer border-2 border-blue-300 dark:border-blue-700 rounded-xl pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-white transition shadow-md hover:border-blue-400 focus:border-blue-500 font-semibold"
            style={{ minWidth: 180, maxWidth: 220 }}
          />
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          <span className="ml-3 text-blue-600 dark:text-blue-300 font-medium">Loading articles...</span>
        </div>
      )}
      {error && <div className="text-red-500 text-center font-semibold py-4">{error}</div>}
      <div className="mt-4">
        {articles.length === 0 && date && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-80">
            <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4">
              <circle cx="32" cy="32" r="30" fill="#e0e7ef" className="dark:fill-slate-700" />
              <path d="M20 40c0-4 8-6 12-6s12 2 12 6v2H20v-2Z" fill="#a0aec0" />
              <ellipse cx="32" cy="28" rx="10" ry="8" fill="#fff" />
              <ellipse cx="28" cy="28" rx="2" ry="2.5" fill="#a0aec0" />
              <ellipse cx="36" cy="28" rx="2" ry="2.5" fill="#a0aec0" />
              <path d="M28 34c1.5 1 6.5 1 8 0" stroke="#a0aec0" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="text-xl font-semibold text-gray-500 dark:text-gray-300 mb-1">No articles found</div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">Looks like there are no articles published on this day.<br />Try selecting a different date.</div>
          </div>
        ) : null}
        {articles.length > 0 && (
          <NewsCarousel initialArticles={articles} />
        )}
      </div>
    </div>
  );
}
