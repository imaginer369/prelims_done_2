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
  const [activeConceptId, setActiveConceptId] = useState<number | null>(null);
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
        />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
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
                <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
                  📚 Important Concepts for Paper
                </h2>
                <div className="flex flex-wrap gap-4">
                  {concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      active={activeConceptId === concept.id}
                      onToggle={() =>
                        setActiveConceptId((prev) =>
                          prev === concept.id ? null : concept.id
                        )
                      }
                    />
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

function ConceptCard({
  concept,
  active,
  onToggle,
}: {
  concept: Concept;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full md:w-auto">
      <button
        onClick={onToggle}
        className={`px-4 py-2 font-semibold rounded-lg shadow transition duration-300 ease-in-out ${
          active
            ? "bg-yellow-500 text-white"
            : "bg-yellow-300 hover:bg-yellow-400 text-gray-800"
        }`}
      >
        {concept.name}
      </button>
      {active && (
        <div className="prose mt-2 p-4 border rounded-md bg-gray-50 shadow-inner">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {concept.info}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

