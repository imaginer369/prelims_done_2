"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

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

export default function NewsCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center m-0 p-0">
        Loading articles...
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center m-0 p-0">
        No articles found.
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="m-0 p-0"
      onSlideChange={() => window.scrollTo(0, 0)}
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id} className="m-0 p-0">
          <ArticleSlide article={article} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

interface ArticleSlideProps {
  article: Article;
}

function ArticleSlide({ article }: ArticleSlideProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const hasSummary = article.quick_summary.trim().length > 0;

  useEffect(() => {
    async function fetchConcepts() {
      if (showFullContent) {
        try {
          const res = await fetch(`/api/concepts?article_id=${article.id}`);
          const data = await res.json();
          setConcepts(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching concepts:", error);
          setConcepts([]);
        }
      }
    }
    fetchConcepts();
  }, [showFullContent, article.id]);

  return (
    <div className="min-h-screen m-0 p-0">
      <div className="relative w-full aspect-video m-0 p-0">
        <Image
          src={article.image_url}
          alt={article.title}
          fill
          className="object-cover m-0 p-0"
	  loading="lazy" 
        />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {article.title}
        </h1>
        <p className="text-sm text-gray-400 italic mb-4">
          {new Date(article.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {hasSummary && !showFullContent ? (
          <>
            <div className="prose prose-indigo mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.quick_summary}
              </ReactMarkdown>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFullContent(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Read More
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="prose prose-indigo mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>

            {concepts.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">
                  Important Concepts for Paper
                </h2>
                <div className="flex flex-wrap gap-4">
                  {concepts.map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConceptCard({ concept }: { concept: Concept }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full md:w-auto">
      <button
        onClick={() => setShowInfo((prev) => !prev)}
        className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
      >
        {concept.name}
      </button>
      {showInfo && (
        <div className="prose mt-2 p-4 border rounded-md bg-gray-50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {concept.info}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

