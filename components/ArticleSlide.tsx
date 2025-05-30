"use client";
import { useState, Suspense, lazy } from "react";
import Image from "next/image";
import ConceptCard from "./ConceptCard";
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
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
  concepts?: Concept[];
}

export default function ArticleSlide({ article }: { article: Article }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const hasSummary = article.quick_summary.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 py-8 px-2 animate-fade-in">
      <div className="w-full max-w-3xl relative rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-slate-800 group bg-white dark:bg-slate-900">
        {/* Animated gradient border */}
        <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl border-4 border-transparent group-hover:border-blue-400 group-focus-within:border-blue-500 transition-all duration-500 animate-gradient-border" style={{background: 'linear-gradient(120deg, #3b82f6 0%, #6366f1 50%, #06b6d4 100%)', opacity: 0.18}} />
        {/* Article Card Content */}
        <div className="relative z-10 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl flex flex-col">
          {/* Article Image with 16:9 ratio */}
          {article.image_url && (
            <div className="relative w-full aspect-video bg-white dark:bg-slate-900 overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 700px"
                priority={false}
              />
            </div>
          )}
          {/* Article Content */}
          <div className="flex-1 flex flex-col p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-blue-200 mb-2 leading-tight drop-shadow-sm">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">
                Article
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                {article.published_at &&
                  new Date(article.published_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
              </span>
            </div>
            {hasSummary && !showFullContent ? (
              <>
                <div className="prose prose-indigo max-w-none mb-6 text-lg text-gray-800 dark:text-white animate-fade-in bg-white dark:bg-slate-900">
                  <Suspense fallback={<div>Loading markdown...</div>}>
                    <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                      {article.quick_summary}
                    </LazyReactMarkdown>
                  </Suspense>
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 text-lg tracking-wide animate-fade-in dark:bg-gradient-to-r dark:from-blue-700 dark:to-cyan-700"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 24px 0 rgba(59,130,246,0.15)',
                      border: 'none',
                    }}
                  >
                    Read More
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="prose prose-indigo max-w-none mb-6 text-lg text-gray-800 dark:text-white animate-fade-in bg-white dark:bg-slate-900">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full bg-white dark:bg-slate-900">
                      {article.concepts.map((concept) => (
                        <ConceptCard key={concept.id} concept={concept} />
                      ))}
                    </div>
                  </section>
                )}
                {article.concepts && article.concepts.length === 0 && (
                  <div className="mt-10 text-gray-400 dark:text-white italic animate-fade-in bg-white dark:bg-slate-900">No concepts found for this article.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
