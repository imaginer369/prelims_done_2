"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Define the Article interface (content is in Markdown)
interface Article {
  id: number;
  title: string;
  content: string; // Markdown content
  image_url: string;
  published_at: string;
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
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id} className="m-0 p-0">
          {/* Each slide takes at least the full viewport height */}
          <div className="min-h-screen m-0 p-0">
            {/* Article Image with strict 16:9 ratio */}
            <div className="relative w-full aspect-video m-0 p-0">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover m-0 p-0"
              />
            </div>
            {/* Article Title and Markdown Content */}
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              <div className="prose prose-indigo max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

