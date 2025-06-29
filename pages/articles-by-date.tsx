import { useState } from "react";

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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select Date to View Articles</h2>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="border rounded px-3 py-2 mb-4 w-full"
      />
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-4 mt-4">
        {articles.length === 0 && date && !loading && !error && (
          <li>No articles found for this date.</li>
        )}
        {articles.map((article) => (
          <li key={article.id} className="border rounded p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{article.published_at}</p>
            <p>{article.quick_summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
