"use client";
import { useState, Suspense, lazy, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import ConceptCard from "./ConceptCard";
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

// Always show full content for date-based carousel (detected via prop)
// If you want to control this via prop, add a prop like `forceFullContent`



interface ArticleSlideProps {
  article: Article;
  forceFullContent?: boolean;
}

export default function ArticleSlide({ article, forceFullContent = false }: ArticleSlideProps) {
  const hasSummary = article.quick_summary.trim().length > 0;
  const router = useRouter();


  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white dark:bg-slate-900 py-8 px-2 animate-fade-in">
      <div className="w-full max-w-3xl relative rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-slate-800 group bg-white dark:bg-slate-900">
        {/* Animated gradient border */}
        <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl border-4 border-transparent group-hover:border-blue-400 group-focus-within:border-blue-500 transition-all duration-500 animate-gradient-border" style={{background: 'linear-gradient(120deg, #3b82f6 0%, #6366f1 50%, #06b6d4 100%)', opacity: 0.18}} />
        {/* Article Card Content */}
        <div className="relative z-10 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl flex flex-col">
          {/* Article Image with 16:9 ratio */}
          {article.image_url && (
            <div className="sticky top-0 z-20 relative w-full aspect-video bg-white dark:bg-slate-900 overflow-hidden">
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
          <div className="flex-1 flex flex-col p-4 sm:p-10 overflow-y-auto max-h-[80vh] pb-35">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-blue-200 mb-2 leading-tight drop-shadow-sm">
              {article.title}
            </h1>Articles are fetched from the backend, likely via an API route such as /api/articles or similar.
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
            {hasSummary && (
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
                    onClick={() => router.push(`/article/${article.id}`)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
