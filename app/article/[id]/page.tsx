"use client";
import { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "next/navigation";
const LazyReactMarkdown = lazy(() => import("react-markdown"));
import remarkGfm from "remark-gfm";

interface Concept {
  id: number;
  name: string;
  info: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  concepts: Concept[];
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function fetchArticle() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/article/${id}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white flex justify-center py-8 px-2">
      <section className="w-full max-w-4xl lg:max-w-5xl xl:max-w-7xl md:rounded-xl shadow-lg p-4 md:p-12 lg:p-20 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></span>
            <span className="text-blue-600 dark:text-blue-300 font-medium text-lg">Loading article...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-lg py-8">{error}</div>
        ) : article ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">{article.title}</h1>
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="w-full max-h-96 object-cover rounded-xl mb-6" />
            )}
            <div className="prose prose-blue prose-lg lg:prose-xl xl:prose-2xl dark:prose-invert max-w-none mb-6 text-gray-800 dark:text-white animate-fade-in bg-white dark:bg-slate-900">
              <Suspense fallback={<div>Loading markdown...</div>}>
                <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </LazyReactMarkdown>
              </Suspense>
            </div>
            {article.concepts && article.concepts.length > 0 && (
              <section className="mt-10 animate-fade-in bg-white dark:bg-slate-900">
                <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300 shadow">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </span>
                  Important Concepts for Paper
                </h2>
                <ul className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 pb-16">
                  {article.concepts.map((concept) => (
                    <li key={concept.id}>
                      <a
                        href={`/concept/${concept.id}`}
                        className="w-full block text-left px-5 py-3 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-700 font-semibold text-blue-700 dark:text-blue-200 transition shadow group flex items-center gap-3"
                      >
                        <span className="flex-1">{concept.name}</span>
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-600 dark:text-blue-300 dark:group-hover:text-blue-100 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </a>
                    </li>
                  ))}
                  <div className="h-40" />
                </ul>
              </section>
            )}
            {article.concepts && article.concepts.length === 0 && (
              <div className="mt-10 text-gray-400 dark:text-white italic animate-fade-in bg-white dark:bg-slate-900">No concepts found for this article.</div>
            )}
          </>
        ) : null}
      </section>
    </main>
  );
}
