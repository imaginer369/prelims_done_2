"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ArticleLoader from "./ArticleLoader";
import ArticleSlide from "./ArticleSlide";

// Import Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
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

  // Force the theme class on the root element according to app theme, overriding device preference for the whole page and Swiper
  useEffect(() => {
    const appTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const root = document.documentElement;
    if (appTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'color-scheme');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', appTheme === 'dark' ? 'dark' : 'light');
  }, []);

  // Add theme classes to Swiper root
  useEffect(() => {
    const appTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const swiperRoots = document.querySelectorAll('.swiper');
    swiperRoots.forEach((el) => {
      if (appTheme === 'dark') {
        el.classList.add('dark');
        el.classList.remove('light');
      } else {
        el.classList.add('light');
        el.classList.remove('dark');
      }
    });
  }, [articles]);

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


