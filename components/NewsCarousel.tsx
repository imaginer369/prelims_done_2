"use client";

import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import ArticleLoader from "./ArticleLoader";

// Import Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

// Dynamically import ReactMarkdown and remarkGfm
const LazyReactMarkdown = lazy(() => import("react-markdown"));
const LazyRemarkGfm = lazy(() => import("remark-gfm"));

import "swiper/css/pagination";

interface Article {
  id: number;
  title: string;
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
}

interface Concept {
  id: number;
  name: string;
  info: string;
}

interface NewsCarouselProps {
  initialArticles?: Article[];
}

/**
 * NewsCarousel component
 * - SSR: Receives first 10 articles as initialArticles (server-side rendered)
 * - Client: Loads next 5 articles at a time as user swipes to the end
 * - Shows loading animation when fetching more
 * - Uses Swiper for swipeable article slides
 */
export default function NewsCarousel({ initialArticles = [] }: NewsCarouselProps) {
  // State for all loaded articles, each with concepts
  const [articles, setArticles] = useState<(Article & { concepts?: Concept[] })[]>(initialArticles);
  // Loading state for initial SSR hydration
  const [loading, setLoading] = useState(initialArticles.length === 0);
  // Loading state for progressive client fetch
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // Number of articles to SSR (first batch)
  const articlesPerPage = 10;
  // Number of articles to fetch per client-side batch
  const fetchBatchSize = 5;
  // Whether there are more articles to fetch
  const [hasMore, setHasMore] = useState(initialArticles.length === articlesPerPage);
  const currentOffset = useRef(initialArticles.length);

  // Fetch concepts for a batch of articles (used for client-side fetches)
  async function fetchConceptsForArticles(articlesBatch: Article[]): Promise<(Article & { concepts?: Concept[] })[]> {
    const conceptsResults = await Promise.all(
      articlesBatch.map(async (article) => {
        try {
          const res = await fetch(`/api/concepts?article_id=${article.id}`);
          const data = await res.json();
          return { ...article, concepts: Array.isArray(data) ? data : [] };
        } catch {
          return { ...article, concepts: [] };
        }
      })
    );
    return conceptsResults;
  }

  /**
   * Initial client-side fetch (only if SSR failed or JS navigation)
   * Only fetches the first 10 articles
   */
  useEffect(() => {
    if (initialArticles.length === 0) {
      async function fetchArticlesAndConcepts() {
        try {
          const res = await fetch("/api/articles?limit=10&offset=0");
          const data: Article[] = await res.json();
          const articlesWithConcepts = await fetchConceptsForArticles(data);
          setArticles(articlesWithConcepts);
        } catch (error) {
          console.error("Error fetching articles/concepts:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchArticlesAndConcepts();
    }
  }, [initialArticles]);

  /**
   * Fetch next batch of articles (5 at a time) as user swipes to the end
   * This is client-only and not SSR
   */
  async function fetchMoreArticles() {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const res = await fetch(`/api/articles?limit=${fetchBatchSize}&offset=${articles.length}`);
      const data: Article[] = await res.json();
      if (data.length < fetchBatchSize) setHasMore(false);
      // Fetch concepts for these articles
      const articlesWithConcepts = await fetchConceptsForArticles(data);
      setArticles((prev) => [...prev, ...articlesWithConcepts]);
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }

  /**
   * Swiper event handler: as user moves forward, always load next 5 articles
   * Triggers on every forward movement, not just at the end
   */
  function handleSlideChange(swiper: any) {
    window.scrollTo(0, 0); // Scroll to top on slide change
    console.log("[handleSlideChange] Swiper index:", swiper.activeIndex, "Articles loaded:", articles.length, "Has more:", hasMore, "Is fetching:", isFetchingMore);
    // Only load more if user moved forward (not on first slide)
    if (
      swiper.activeIndex > 0 &&
      hasMore &&
      !isFetchingMore &&
      // Only trigger if we haven't already loaded for this index
      articles.length <= swiper.activeIndex + fetchBatchSize
    ) {
      console.log("[handleSlideChange] Triggering fetchMoreArticles()");
      fetchMoreArticles();
    }
  }

  // Show loader while fetching initial SSR/client batch
  if (loading) {
    return <ArticleLoader />;
  }

  // Show message if no articles found
  if (!articles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center m-0 p-0">
        No articles found.
      </div>
    );
  }

  // Render Swiper with loaded articles and loading slide if fetching more
  return (
    <Swiper
      modules={[]}
      spaceBetween={30}
      slidesPerView={1}
      className="m-0 p-0"
      onSlideChange={handleSlideChange}
    >
      {articles.map((article) => (
        <SwiperSlide
          key={article.id}
          className="m-0 p-0"
        >
          <ArticleSlide article={article} />
        </SwiperSlide>
      ))}
      {/* Show loader slide at the end while fetching more */}
      {isFetchingMore && (
        <SwiperSlide className="swiper-slide-loading m-0 p-0">
          <ArticleLoader />
        </SwiperSlide>
      )}
    </Swiper>
  );
}

interface ArticleSlideProps {
  article: Article & { concepts?: Concept[] };
}

/**
 * ArticleSlide component
 * - Renders a single article (image, title, summary/content)
 * - Fetches and displays concepts when full content is shown
 */
function ArticleSlide({ article }: ArticleSlideProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const hasSummary = article.quick_summary.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-8 px-2">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Article Image with 16:9 ratio */}
        {article.image_url && (
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-slate-800 overflow-hidden">
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
        <div className="flex-1 flex flex-col p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-blue-200 mb-2 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Article
            </span>
            <span className="text-sm text-gray-400 italic">
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
              <div className="prose prose-indigo max-w-none mb-6 text-lg text-gray-800 dark:prose-invert">
                <Suspense fallback={<div>Loading markdown...</div>}>
                  <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.quick_summary}
                  </LazyReactMarkdown>
                </Suspense>
              </div>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setShowFullContent(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 text-lg"
                >
                  Read More
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="prose prose-indigo max-w-none mb-6 text-lg text-gray-800 dark:prose-invert animate-fade-in">
                <Suspense fallback={<div>Loading markdown...</div>}>
                  <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content}
                  </LazyReactMarkdown>
                </Suspense>
              </div>
              {article.concepts && article.concepts.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-200 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </span>
                    Important Concepts for Paper
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {article.concepts.map((concept) => (
                      <ConceptCard key={concept.id} concept={concept} />
                    ))}
                  </div>
                </section>
              )}
              {article.concepts && article.concepts.length === 0 && (
                <div className="mt-10 text-gray-400 italic">No concepts found for this article.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ConceptCard component
 * - Shows a button for each concept, toggles info on click
 */
function ConceptCard({ concept }: { concept: Concept }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative flex flex-col bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group focus-within:ring-2 focus-within:ring-blue-400 min-h-[120px]">
      <button
        onClick={() => setShowInfo((prev) => !prev)}
        className={`w-full flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-t-2xl shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${showInfo ? '' : 'rounded-b-2xl'}`}
        aria-expanded={showInfo}
        aria-controls={`concept-info-${concept.id}`}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </span>
        <span className="truncate text-lg font-medium flex-1 text-left">{concept.name}</span>
        <svg className={`ml-2 w-5 h-5 transition-transform duration-200 ${showInfo ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div
        id={`concept-info-${concept.id}`}
        className={`w-full overflow-hidden transition-all duration-300 ${showInfo ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} rounded-b-2xl`}
        aria-hidden={!showInfo}
      >
        <div className="prose prose-blue dark:prose-invert p-4 max-h-[320px] overflow-y-auto animate-fade-in bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 shadow-lg rounded-b-2xl">
          <Suspense fallback={<div>Loading markdown...</div>}>
            <LazyReactMarkdown remarkPlugins={[remarkGfm]}>{concept.info}</LazyReactMarkdown>
          </Suspense>
        </div>
      </div>
    </div>
  );
}


