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

// Define the Article interface
interface Article {
  id: number;
  title: string;
  quick_summary: string; // Markdown formatted summary
  content: string;       // Markdown formatted full content
  image_url: string;
  published_at: string;
}

// Component for an individual article slide
function ArticleSlide({ article }: { article: Article }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const hasSummary = article.quick_summary.trim().length > 0;

  return (
    <div className="min-h-screen m-0 p-0">
      {/* Article Image with 16:9 ratio */}
      <div className="relative w-full aspect-video m-0 p-0">
        <Image
          src={article.image_url}
          alt={article.title}
          fill
          className="object-cover m-0 p-0"
        />
      </div>
      {/* Article Title and Content */}
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
          <div className="prose prose-indigo">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

// Main NewsCarousel component
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
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id} className="m-0 p-0">
          <ArticleSlide article={article} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

